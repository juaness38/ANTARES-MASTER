/**
 * 🔧 SCRIPT DE PRUEBA JARVIS ESPECÍFICO
 * Prueba la conectividad exacta que usa el cliente Jarvis
 */

async function testJarvisAPI() {
  console.log('🤖 Testing Jarvis Client Connectivity...\n');

  // Test 1: Health check del endpoint que usa Jarvis
  console.log('1️⃣ Testing Jarvis health check...');
  try {
    const healthResponse = await fetch('http://localhost:3000/api/driver-ai', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Jarvis-Test/1.0.0'
      }
    });
    
    console.log(`   Status: ${healthResponse.status} ${healthResponse.statusText}`);
    
    if (healthResponse.ok) {
      const healthData = await healthResponse.json();
      console.log(`   Health Data:`, healthData);
    } else {
      const errorText = await healthResponse.text();
      console.log(`   Error Response:`, errorText);
    }
  } catch (error) {
    console.log(`   Error: ${error.message}`);
  }

  // Test 2: Protein analysis (como lo haría Jarvis)
  console.log('\n2️⃣ Testing protein analysis call...');
  try {
    const proteinResponse = await fetch('http://localhost:3000/api/driver-ai', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'User-Agent': 'Jarvis-Client/1.0.0'
      },
      body: JSON.stringify({
        query: 'MALVRDPEPA',
        context: {
          source: 'jarvis',
          intent: 'protein_analysis'
        }
      })
    });
    
    console.log(`   Status: ${proteinResponse.status} ${proteinResponse.statusText}`);
    
    if (proteinResponse.ok) {
      const proteinData = await proteinResponse.json();
      console.log(`   Protein Analysis Response:`, JSON.stringify(proteinData, null, 2));
    } else {
      const errorText = await proteinResponse.text();
      console.log(`   Error Response:`, errorText);
    }
  } catch (error) {
    console.log(`   Error: ${error.message}`);
  }

  // Test 3: Conversational query (como lo haría Jarvis)
  console.log('\n3️⃣ Testing conversational query...');
  try {
    const chatResponse = await fetch('http://localhost:3000/api/driver-ai', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'User-Agent': 'Jarvis-Client/1.0.0'
      },
      body: JSON.stringify({
        query: 'Hello Jarvis, how are you?',
        context: {
          source: 'jarvis',
          intent: 'conversational'
        }
      })
    });
    
    console.log(`   Status: ${chatResponse.status} ${chatResponse.statusText}`);
    
    if (chatResponse.ok) {
      const chatData = await chatResponse.json();
      console.log(`   Chat Response:`, JSON.stringify(chatData, null, 2));
    } else {
      const errorText = await chatResponse.text();
      console.log(`   Error Response:`, errorText);
    }
  } catch (error) {
    console.log(`   Error: ${error.message}`);
  }

  // Test 4: Direct Driver AI backend (sin proxy)
  console.log('\n4️⃣ Testing direct Driver AI backend...');
  try {
    const directResponse = await fetch('http://3.85.5.222:8001/api/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'User-Agent': 'Jarvis-Direct-Test/1.0.0'
      },
      body: JSON.stringify({
        sequence: 'MALVRDPEPA',
        analysis_type: 'blast'
      })
    });
    
    console.log(`   Status: ${directResponse.status} ${directResponse.statusText}`);
    
    if (directResponse.ok) {
      const directData = await directResponse.json();
      console.log(`   Direct Backend Response:`, JSON.stringify(directData, null, 2));
    } else {
      const errorText = await directResponse.text();
      console.log(`   Error Response:`, errorText);
    }
  } catch (error) {
    console.log(`   Error: ${error.message}`);
  }

  console.log('\n✅ Jarvis connectivity test completed!');
}

// Ejecutar test
testJarvisAPI().catch(console.error);
