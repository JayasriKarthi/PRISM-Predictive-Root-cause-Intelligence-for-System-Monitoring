import psycopg2
from psycopg2.extras import execute_values
import re

DB_URI = "postgresql://metrics_manager:password@timescaledb:5432/metrics_db"

def get_connection():
    return psycopg2.connect(DB_URI)

def make_table_name(container_name: str) -> str:
    """Convert container name to safe PostgreSQL table name."""
    safe_name = re.sub(r'[^0-9a-zA-Z_]', '_', container_name)
    if safe_name[0].isdigit():
        safe_name = f"t_{safe_name}"
    return f"container_{safe_name.lower()}"

def ensure_table_exists(container_name: str):
    table_name = make_table_name(container_name)
    with get_connection() as conn, conn.cursor() as cur:
        cur.execute(f"""
            CREATE TABLE IF NOT EXISTS {table_name} (
                time_stamp TIMESTAMPTZ NOT NULL,
                cpu_usage DOUBLE PRECISION,
                memory_usage DOUBLE PRECISION,
                network_usage DOUBLE PRECISION,
                io_usage DOUBLE PRECISION
            );
        """)
        cur.execute(f"""
            SELECT create_hypertable('{table_name}', 'time_stamp', if_not_exists => TRUE);
        """)
        conn.commit()
    return table_name

def insert_metrics(container_labels, metrics):
    container_name = container_labels.get("name") or container_labels.get("id", "unknown_container")
    table_name = ensure_table_exists(container_name)

    with get_connection() as conn, conn.cursor() as cur:
        execute_values(cur,
            f"INSERT INTO {table_name} (time_stamp, cpu_usage, memory_usage, network_usage, io_usage) VALUES %s",
            [(metrics['timestamp'], metrics['cpu'], metrics['mem'], metrics['net'], metrics['io'])]
        )
        conn.commit()
