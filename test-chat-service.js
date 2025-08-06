// Test específico del ChatService
import { ChatService } from './lib/chat-service.js';

const testMessage = "MALVRDPEPAAGSSRWLPTHVQVTVLRASGLRGKSSGAGSTSDAYTVIQVGREKYSTSVVEKTQGCPEWCEECSFELPPGALDGLLRAQEADAGPAPWASGPNAACELVLTTMHRSLIGVDKFLGRATVALDEVFRAGRAQHTQWYRLHSKPGKKEKERGEIQVTIQFTRNNLSASMDLSMKDKPRSPFSKLKDRVKGKKKYDLESASAILPSSALEDPELGSLGKMGKAKGFFLRNKLRKSSLTQSNTSLGSDSTLSSTSGSLVYQGPGAELLTRSPSHSSWLSTEGGRDSIQSPKLLTHKRTYSDEASQLRAAPPRALLELQGHLDGASRSSLCVNGSHVYNEEPQPPLRHRSSISGPFPPSSSLHSVPPRSSEEGSRSSDDSWGRGSHGTSSSEAVPGQEELSKQAKGASCSGEEEARLPEGKPVQVATPMVASSEAVAAEKDRKPRMGLFHHHHHQGLSRSEQGRRGSVGEKGSPSLGASPHHSSTGEEKAKSSWFGLRESKEPTQKPSPHPVKPLTAAPVEASPDRKQPRTSTSALSSGLERLKTVTSGGIQSVLPASQLGSSVDTKRPKDSAVLDQSAKYYHLTHDELIGLLLQRERELSQRDEHVQELESYIDRLLVRIMETSPTLLQISPGPPK";

async function testChatService() {
  console.log('🧪 Testing ChatService integration...');
  
  const chatService = new ChatService('test-key', { 
    fallbackToOpenAI: true,
    enableDriverAI: true 
  });
  
  // Check Driver AI health
  console.log('🏥 Checking Driver AI health...');
  const isHealthy = await chatService.checkDriverAIHealth();
  console.log('Driver AI Status:', isHealthy);
  
  // Send message
  console.log('💬 Sending message to ChatService...');
  try {
    const response = await chatService.sendMessage(testMessage, [], 'test-user');
    console.log('Response:', JSON.stringify(response, null, 2));
  } catch (error) {
    console.error('ChatService error:', error);
  }
}

testChatService();
