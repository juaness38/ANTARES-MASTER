/**
 * 🧬 QUERY CLASSIFIER - DRIVER AI INTEGRATION
 * Clasifica queries entre científicas y generales
 */

export interface QueryClassification {
  type: 'scientific' | 'general';
  domain: string;
  confidence: number;
  keywords: string[];
}

export class QueryClassifier {
  private scientificKeywords = {
    protein_analysis: [
      'protein', 'proteína', 'amino', 'sequence', 'secuencia', 'fold', 'structure',
      'crystal', 'pdb', 'domain', 'binding', 'enzyme', 'catalysis', 'substrate',
      'mayahuelin', 'mayahuelina', 'uniprot', 'pfam', 'interpro', 'swiss-prot'
    ],
    molecular_dynamics: [
      'molecular dynamics', 'md simulation', 'trajectory', 'gromacs', 'amber',
      'force field', 'solvation', 'dynamics', 'simulation', 'conformational'
    ],
    drug_design: [
      'drug', 'fármaco', 'ligand', 'docking', 'binding affinity', 'admet',
      'pharmacokinetics', 'toxicity', 'bioavailability', 'medicinal chemistry'
    ],
    bioinformatics: [
      'blast', 'ncbi', 'alignment', 'phylogenetic', 'evolution', 'genome',
      'transcriptome', 'gene', 'expression', 'annotation', 'biomarker',
      'fasta', 'clustal', 'muscle', 'mafft', 'hmmer', 'pfam', 'go term'
    ],
    astrobiological: [
      'astrobiology', 'extremophile', 'biosignature', 'prebiotic', 'origin of life',
      'mars', 'europa', 'titan', 'exoplanet', 'habitability', 'extremófilos'
    ],
    structural_biology: [
      'x-ray', 'crystallography', 'nmr', 'cryo-em', 'electron microscopy',
      'structure determination', 'refinement', 'resolution', 'ramachandran',
      'pymol', 'chimera', 'molstar', 'alphafold', 'colabfold'
    ]
  };

  private generalKeywords = [
    'hello', 'hi', 'hola', 'how are you', 'como estas', 'what is', 'que es',
    'explain', 'explica', 'help', 'ayuda', 'thanks', 'gracias', 'weather',
    'time', 'date', 'joke', 'chiste', 'story', 'historia'
  ];

  classify(query: string): QueryClassification {
    const lowerQuery = query.toLowerCase();
    const words = lowerQuery.split(/\s+/);
    
    // Detectar secuencias de proteínas (cadenas largas de aminoácidos)
    const proteinSequencePattern = /[ACDEFGHIKLMNPQRSTVWY]{20,}/i;
    if (proteinSequencePattern.test(query)) {
      return {
        type: 'scientific',
        domain: 'protein_analysis',
        confidence: 0.95,
        keywords: ['protein sequence', 'amino acid sequence']
      };
    }

    // Detectar triggers específicos para Driver AI
    const driverTriggers = [
      'driver', 'blast', 'pdb', 'docking', 'molecular', 'mayahuelin', 'mayahuelina',
      'estructura', 'proteína', 'secuencia', 'análisis', 'consulta'
    ];
    
    const triggerMatches = driverTriggers.filter(trigger => 
      lowerQuery.includes(trigger)
    );
    
    if (triggerMatches.length > 0) {
      // Es muy probable que necesite Driver AI
      const confidence = Math.min(triggerMatches.length * 0.3, 0.9);
      return {
        type: 'scientific',
        domain: triggerMatches.includes('blast') ? 'bioinformatics' : 
                triggerMatches.includes('docking') ? 'drug_design' :
                triggerMatches.includes('pdb') || triggerMatches.includes('estructura') ? 'protein_analysis' :
                'protein_analysis',
        confidence,
        keywords: triggerMatches
      };
    }
    
    // Verificar si es una consulta general
    const generalMatches = this.generalKeywords.filter(keyword => 
      lowerQuery.includes(keyword)
    );
    
    if (generalMatches.length > 0) {
      return {
        type: 'general',
        domain: 'general_science',
        confidence: 0.8,
        keywords: generalMatches
      };
    }

    // Clasificar por dominio científico
    let bestMatch = {
      domain: 'general_science',
      confidence: 0,
      keywords: [] as string[]
    };

    for (const [domain, keywords] of Object.entries(this.scientificKeywords)) {
      const matches = keywords.filter(keyword => 
        lowerQuery.includes(keyword.toLowerCase())
      );
      
      if (matches.length > 0) {
        const confidence = Math.min(matches.length / keywords.length * 2, 1);
        
        if (confidence > bestMatch.confidence) {
          bestMatch = {
            domain,
            confidence,
            keywords: matches
          };
        }
      }
    }

    // Si hay matches científicos significativos
    if (bestMatch.confidence > 0.1) {
      return {
        type: 'scientific',
        domain: bestMatch.domain,
        confidence: bestMatch.confidence,
        keywords: bestMatch.keywords
      };
    }

    // Por defecto, si contiene términos técnicos, es científica
    const technicalWords = words.filter(word => 
      word.length > 6 || 
      /^[A-Z][a-z]+[A-Z]/.test(word) || // CamelCase
      /\d/.test(word) // Contiene números
    );

    if (technicalWords.length > 2) {
      return {
        type: 'scientific',
        domain: 'general_science',
        confidence: 0.6,
        keywords: technicalWords
      };
    }

    return {
      type: 'general',
      domain: 'general_science',
      confidence: 0.5,
      keywords: []
    };
  }
}

export const queryClassifier = new QueryClassifier();
