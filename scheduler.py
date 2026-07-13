import time
import subprocess
import logging
from apscheduler.schedulers.background import BackgroundScheduler

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger("IngestionScheduler")

def run_pipeline():
    logger.info("Starting the Daily Ingestion Pipeline...")
    try:
        # 1. Run the Web Scraper
        logger.info("Executing scraper.py...")
        subprocess.run(["python", "scraper.py"], check=True)
        
        # 2. Run the Vector Database Ingestion
        logger.info("Executing ingest.py...")
        subprocess.run(["python", "ingest.py"], check=True)
        
        logger.info("Daily Ingestion Pipeline completed successfully!")
    except subprocess.CalledProcessError as e:
        logger.error(f"Pipeline failed during script execution: {e}")
    except Exception as e:
        logger.error(f"An unexpected error occurred in the pipeline: {e}")

if __name__ == "__main__":
    scheduler = BackgroundScheduler()
    
    # Schedule the pipeline to run every 24 hours
    scheduler.add_job(run_pipeline, 'interval', hours=24)
    scheduler.start()
    
    logger.info("Scheduler started. The ingestion pipeline is scheduled to run every 24 hours.")
    
    try:
        # Keep the main thread alive so the background scheduler continues to run
        while True:
            time.sleep(60)
    except (KeyboardInterrupt, SystemExit):
        scheduler.shutdown()
        logger.info("Scheduler shutting down gracefully...")
