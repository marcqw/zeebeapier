import 'dotenv/config'
import express from 'express';
import { Camunda8 } from '@camunda8/sdk';

const c8 = new Camunda8();
const zb = c8.getZeebeGrpcApiClient();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Endpoint to start a process instance
app.post('/create-process-instance/:processId', async (req, res) => {
  const processId = req.params.processId;
  try {
    zb.createProcessInstance({
      bpmnProcessId: processId,
      variables: {...req.body,}
    }).then(res1 => console.log(JSON.stringify(res1, null, 2)))
    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint to publish a message for correlation
app.post('/publish-message/:messageName/:correlationKey', async (req, res) => {
  try {
    const messageName = req.params.messageName;
    const correlationKey = req.params.correlationKey;
    zb.publishMessage({
      name: messageName,
      correlationKey: correlationKey,
      variables: {...req.body,}
    })
    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});