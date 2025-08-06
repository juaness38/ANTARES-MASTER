# 🏗️ DRIVER AI - ARQUITECTURA REAL REQUERIDA

## FLUJO OBLIGATORIO para /api/chat

```
[USER INPUT] → [CHAT ENDPOINT] → [INTENT CLASSIFIER] → [ENTITY EXTRACTOR] → [MODULE ROUTER]
                                        ↓
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                          DECISION TREE REQUERIDO                                   │
├─────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                     │
│  INPUT: "hola"                                                                      │
│  └─ INTENT: conversational → RESPONSE: GPT/Claude greeting                         │
│                                                                                     │
│  INPUT: "analiza esta secuencia: MKTAYI..."                                        │
│  └─ INTENT: analysis + ENTITY: protein_sequence                                    │
│     └─ ROUTE: /api/analyze with extracted sequence                                 │
│                                                                                     │
│  INPUT: "¿cuáles son los inhibidores de BRAF?"                                     │
│  └─ INTENT: information_request + ENTITY: protein="BRAF"                           │
│     └─ ROUTE: ChEMBL/PDB query + LLM formatting                                    │
│                                                                                     │
│  INPUT: "ejecuta PCR para gen P53"                                                 │
│  └─ INTENT: experiment + ENTITY: technique="PCR", target="P53"                     │
│     └─ ROUTE: Protocol execution system                                            │
│                                                                                     │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

## COMPONENTES REALES REQUERIDOS

### 1. Intent Classifier
- **Modelo**: spaCy NLP / Transformers / Custom classifier
- **Clases**: [conversational, analysis, information_request, experiment_command]
- **Confianza mínima**: 0.7

### 2. Entity Extractor  
- **Proteínas**: UniProt ID recognition (P53, BRAF, etc.)
- **Moléculas**: ChEMBL compound detection
- **Técnicas**: PCR, Mass Spec, Western Blot, etc.
- **Secuencias**: Amino acid pattern matching

### 3. Module Router
```python
def route_request(intent, entities, original_query):
    if intent == "analysis" and entities.has_sequence:
        return analyze_api.process(entities.sequence)
    elif intent == "information_request" and entities.has_protein:
        return knowledge_base.query_protein(entities.protein)
    elif intent == "conversational":
        return llm_chat.generate_response(original_query)
    # etc...
```

### 4. LLM Integration (REAL)
- **Provider**: OpenAI API / Anthropic Claude / Local Llama
- **Model**: gpt-4o / claude-3.5-sonnet / llama-3.2-70b
- **System Prompt**: AstroFlora scientific assistant persona

### 5. Knowledge Base Connectors
- **ChEMBL API**: Drug/compound information
- **UniProt API**: Protein data
- **PDB API**: Structural data
- **Local Cache**: Frequent queries

## IMPLEMENTACIÓN MÍNIMA VIABLE

### Fase 1: LLM Connection
```python
# /api/chat endpoint - REAL implementation
@app.post("/api/chat")
async def chat_endpoint(request: ChatRequest):
    # NO hardcoded responses
    llm_response = await openai_client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {"role": "system", "content": ASTROFLORA_SYSTEM_PROMPT},
            {"role": "user", "content": request.message}
        ]
    )
    return {"response": llm_response.choices[0].message.content}
```

### Fase 2: Intent Classification
```python
def classify_intent(message):
    # Real NLP classification, not string matching
    intent_scores = nlp_model(message)
    return max(intent_scores, key=intent_scores.get)
```

### Fase 3: Entity Extraction
```python
def extract_entities(message):
    # Real entity recognition
    entities = {
        "proteins": extract_protein_mentions(message),
        "compounds": extract_compound_mentions(message),
        "sequences": extract_amino_acid_sequences(message)
    }
    return entities
```

## PRUEBA DE VERIFICACIÓN OBLIGATORIA

**Input**: "Resume las funciones de la proteína BRAF"

**Expected Output** (real LLM response):
```
BRAF (B-Raf proto-oncogene) es una serina/treonina quinasa que forma parte de la vía de señalización RAS/RAF/MEK/ERK. Sus funciones principales incluyen:

1. Regulación del crecimiento celular
2. Control de la diferenciación celular  
3. Participación en apoptosis
4. [etc... respuesta real del modelo]
```

**NOT ACCEPTABLE**: 
- "Mensaje recibido: Resume las funciones..."
- "Este es el endpoint correcto para chat..."
- Any hardcoded template response

## RECURSOS TÉCNICOS REQUERIDOS

1. **LLM API Key**: OpenAI/Anthropic/etc.
2. **NLP Library**: spaCy, Transformers, or custom model
3. **Knowledge Base APIs**: ChEMBL, UniProt, PDB access
4. **Vector Database**: For semantic search (optional Phase 2)
5. **Caching System**: Redis for frequent queries

## TIMELINE REALISTA

- **Week 1**: Architecture design approval
- **Week 2**: LLM integration (Phase 1)
- **Week 3**: Intent classification (Phase 2)  
- **Week 4**: Entity extraction (Phase 3)
- **Week 5**: Knowledge base integration
- **Week 6**: Testing with real scientific queries

## PROHIBICIONES ABSOLUTAS

❌ NO hardcoded responses in production
❌ NO "simulated" AI behavior  
❌ NO mocks presented as working features
❌ NO template-based chat responses
❌ NO fake "intelligence" implementations
