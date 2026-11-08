# MzansiRide SafeAI
*AWS x Praesignis x First Distribution Hackathon 2026 Submission*

## Overview
MzansiRide SafeAI is a proactive safety and shared mobility prototype designed for South African commuters. It bridges affordability through shared fares with real-time transit safety features, automated check-in timers, and contextual AI assistance.

## Live Deployment
* **Amplify Live App:** [View Deployed Frontend](https://main.d2o3xfewmlc6zg.amplifyapp.com)

## Architecture & AWS Services Used
* **Amazon API Gateway & AWS Lambda:** Managed REST endpoints handling safety rule evaluation.
* **Amazon DynamoDB (`mzansiSafeRideTrips`):** Logged active trips, audit trails, and alert statuses.
* **Amazon SNS:** Dispatched automated escalation alerts to trusted contacts.
* **Amazon Bedrock:** Powered real-time contextual safety guidance and chat responses.

## Screenshots & Architecture Proof
Check out the `screenshots/` directory in this repository for full visual records of:
* The live AWS DynamoDB dashboard and active trip audit trail records.
* The AWS Lambda console showing the escalation and SNS email function logic.
* The live React application running on AWS Amplify showing Safe Journey Mode and emergency alert triggers.

## Local Development
1. Clone the repository:
   ```bash
   git clone https://github.com/Lwethu0409/mzansiride-safeai.git
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
