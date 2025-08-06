// Test directo del query classifier
const testSequence = "MALVRDPEPAAGSSRWLPTHVQVTVLRASGLRGKSSGAGSTSDAYTVIQVGREKYSTSVVEKTQGCPEWCEECSFELPPGALDGLLRAQEADAGPAPWASGPNAACELVLTTMHRSLIGVDKFLGRATVALDEVFRAGRAQHTQWYRLHSKPGKKEKERGEIQVTIQFTRNNLSASMDLSMKDKPRSPFSKLKDRVKGKKKYDLESASAILPSSALEDPELGSLGKMGKAKGFFLRNKLRKSSLTQSNTSLGSDSTLSSTSGSLVYQGPGAELLTRSPSHSSWLSTEGGRDSIQSPKLLTHKRTYSDEASQLRAAPPRALLELQGHLDGASRSSLCVNGSHVYNEEPQPPLRHRSSISGPFPPSSSLHSVPPRSSEEGSRSSDDSWGRGSHGTSSSEAVPGQEELSKQAKGASCSGEEEARLPEGKPVQVATPMVASSEAVAAEKDRKPRMGLFHHHHHQGLSRSEQGRRGSVGEKGSPSLGASPHHSSTGEEKAKSSWFGLRESKEPTQKPSPHPVKPLTAAPVEASPDRKQPRTSTSALSSGLERLKTVTSGGIQSVLPASQLGSSVDTKRPKDSAVLDQSAKYYHLTHDELIGLLLQRERELSQRDEHVQELESYIDRLLVRIMETSPTLLQISPGPPK";

console.log('🧪 Testing Query Classifier...');

// Simular el clasificador
const proteinSequencePattern = /[ACDEFGHIKLMNPQRSTVWY]{20,}/i;
const isProteinSequence = proteinSequencePattern.test(testSequence);

console.log('Sequence length:', testSequence.length);
console.log('Is protein sequence?', isProteinSequence);
console.log('Pattern match result:', testSequence.match(proteinSequencePattern));

// Test de query general
const generalQuery = "cual es esta proteina?";
const isGeneralMatch = proteinSequencePattern.test(generalQuery);
console.log('General query match:', isGeneralMatch);

// Test de query con secuencia
const queryWithSequence = `que proteina es esta? : ${testSequence.substring(0, 100)}`;
const isSequenceQueryMatch = proteinSequencePattern.test(queryWithSequence);
console.log('Query with sequence match:', isSequenceQueryMatch);
