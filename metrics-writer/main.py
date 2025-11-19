import time
from prometheus_client import fetch_metrics
from db import insert_metrics

#DB Updation Interval
INTERVAL_SECONDS = 30

if __name__ == "__main__":
    print("Writing Prometheus → TimescaleDB every 30s.")
    while True:
        try:
            metrics_data = fetch_metrics()
            for container_name, metrics in metrics_data.items():
                insert_metrics(metrics["labels"], metrics)
                print(f"Inserted metrics for {container_name}")
        except Exception as e:
            print("Error:", e)
        time.sleep(INTERVAL_SECONDS)

