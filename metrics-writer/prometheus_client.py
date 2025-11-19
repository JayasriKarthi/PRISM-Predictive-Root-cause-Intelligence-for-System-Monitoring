import requests
import datetime

PROMETHEUS_URL = "http://prometheus:9090/api/v1/query"

QUERIES = {
    "cpu_usage": 'rate(container_cpu_usage_seconds_total{id!="",name!=""}[1m])',
    "memory_usage": 'container_memory_usage_bytes{id!="",name!=""}',
    "network_usage": 'rate(container_network_receive_bytes_total{id!="",name!=""}[1m])',
    "io_usage": 'rate(container_blkio_device_usage_total{id!="",name!=""}[1m])',
}

def fetch_metrics():
    results = {}

    for key, query in QUERIES.items():
        resp = requests.get(PROMETHEUS_URL, params={"query": query})
        if resp.status_code != 200:
            print(f"Error querying Prometheus for {key}: {resp.status_code}")
            continue

        data = resp.json().get("data", {}).get("result", [])
        for item in data:
            labels = item["metric"]
            container_name = labels.get("name")
            container_id = labels.get("id")

            # Skip system metrics, only include real containers
            if not container_name or "docker" not in container_id:
                continue

            value = float(item["value"][1])
            ts = datetime.datetime.utcfromtimestamp(float(item["value"][0]))

            # Initialize entry if first time seen
            key_ = container_name
            if key_ not in results:
                results[key_] = {
                    "labels": labels,
                    "timestamp": ts,
                    "cpu": 0, "mem": 0, "net": 0, "io": 0
                }

            if "cpu" in key:
                results[key_]["cpu"] = value
            elif "memory" in key:
                results[key_]["mem"] = value
            elif "network" in key:
                results[key_]["net"] = value
            elif "io" in key:
                results[key_]["io"] = value

    return results
