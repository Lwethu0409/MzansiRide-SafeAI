export type StatusIcon = 'check' | 'warn' | 'clock';

export function getStatusLists(awsLive: boolean | null) {
  const done = [
    'Safe Journey Mode flow: request, journey, alert, check-in, escalation',
    'Demo events (prolonged stop, route deviation) with a 2-minute check-in timer',
    'Persistent custom trusted contact details saved locally and to DynamoDB',
    'Individual & Shared ride sub-tabs with dynamic fare savings display',
  ];
  const aws = [
    'API Gateway and Lambda apply the safety rules',
    'Amazon Bedrock writes the explanations and answers questions',
    'Alerts and check-in replies saved in Amazon DynamoDB',
    'Help request dispatches alerts and logs records',
  ];
  const simulated = [
    'Trips, driver and vehicle (sample data, not verified)',
    'GPS: the map and demo buttons stand in for live location',
    'Booking, fares and payments',
    'Dashboard metrics fetched from AWS backend',
  ];
  if (!awsLive) {
    simulated.push(
      'AWS back end not connected in this session: assistant replies are canned, nothing is saved, help messages are simulated',
    );
  }
  const todo = [
    'Live GPS and map-based route detection',
    'Driver identity and vehicle verification',
    'Emergency-service integration',
    'Sign-in with Amazon Cognito',
    'Amazon Bedrock Guardrails',
    'POPIA review, consent and data retention rules',
    'Real ride matching, payments and native apps',
  ];
  return { done: awsLive ? done.concat(aws) : done, simulated, todo };
}
