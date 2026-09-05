import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CheckCircle2, XCircle, ArrowRight, RotateCcw, Award, Zap, Sparkles, 
  HelpCircle, Timer, BookOpen, ChevronRight, Check, Layers, Clock
} from 'lucide-react';
import db from '../services/db';

export default function Quiz() {
  const navigate = useNavigate();
  const currentUser = db.getCurrentUser() || {};

  // Supported Course Tracks
  const courseTracks = [
    { key: 'Full-Stack Web Engineering', label: 'Full-Stack Web Engineering', icon: '🌐' },
    { key: 'AI & Machine Learning', label: 'Artificial Intelligence & ML', icon: '🧠' },
    { key: 'Cloud & DevOps Engineering', label: 'Cloud Computing & DevOps', icon: '☁️' },
    { key: 'Cybersecurity & Defense', label: 'Cybersecurity & Ethical Hacking', icon: '🛡️' },
  ];

  // Pick initial course based on profile
  const userJob = (currentUser.dreamJob || '').toLowerCase();
  let initialCourse = 'Full-Stack Web Engineering';
  if (userJob.includes('ai') || userJob.includes('machine learning') || userJob.includes('data')) {
    initialCourse = 'AI & Machine Learning';
  } else if (userJob.includes('cloud') || userJob.includes('devops')) {
    initialCourse = 'Cloud & DevOps Engineering';
  } else if (userJob.includes('security')) {
    initialCourse = 'Cybersecurity & Defense';
  }

  const [selectedCourse, setSelectedCourse] = useState(initialCourse);

  // 15 Dynamic Questions tailored per course track
  const questionBanks = {
    'Full-Stack Web Engineering': [
      { id: 1, topic: 'Data Structures', question: 'What is the average time complexity of lookup, insertion, and deletion in a Hash Table with good hash distribution?', options: ['O(n)', 'O(log n)', 'O(1)', 'O(n log n)'], correctIndex: 2, explanation: 'Hash tables offer O(1) average time complexity because an effective hash function maps keys directly to bucket indices in constant time.' },
      { id: 2, topic: 'Algorithms', question: 'Which sorting algorithm has a guaranteed worst-case time complexity of O(n log n) and is stable?', options: ['QuickSort', 'MergeSort', 'HeapSort', 'BubbleSort'], correctIndex: 1, explanation: 'MergeSort divides the array recursively and merges sorted halves with guaranteed O(n log n) worst-case time while preserving relative order.' },
      { id: 3, topic: 'React Core', question: 'What is the primary purpose of the dependency array in the React useEffect hook?', options: ['To define prop types', 'To determine when to re-run the effect based on value changes between renders', 'To bind methods to class instance', 'To force synchronous DOM repaints'], correctIndex: 1, explanation: 'React compares each value in the dependency array with its previous render value using Object.is. If any changed, the effect re-runs.' },
      { id: 4, topic: 'JavaScript Engine', question: 'In the JavaScript Event Loop, which queue has priority execution before the macrotask queue?', options: ['Web Workers queue', 'Microtask queue (Promises & queueMicrotask)', 'Rendering repaint queue', 'I/O Polling queue'], correctIndex: 1, explanation: 'Microtasks are drained completely at the end of each macrotask before the next macrotask is picked up.' },
      { id: 5, topic: 'Database Architecture', question: 'What does the "I" in ACID database transactions stand for, and what does it guarantee?', options: ['Indexing: queries always use B-Trees', 'Idempotence: duplicate requests produce identical outputs', 'Isolation: concurrent transactions execute without interfering with one another', 'Integrity: foreign keys are enforced at runtime'], correctIndex: 2, explanation: 'Isolation guarantees that concurrent execution of transactions leaves the database in the same state as if they were executed sequentially.' },
      { id: 6, topic: 'Web Security', question: 'Which HTTP response header is most critical to prevent Cross-Site Scripting (XSS) by restricting where scripts can load from?', options: ['Content-Security-Policy', 'X-Frame-Options', 'Access-Control-Allow-Origin', 'Strict-Transport-Security'], correctIndex: 0, explanation: 'Content-Security-Policy (CSP) allows server operators to restrict which domains the browser is allowed to load scripts and assets from.' },
      { id: 7, topic: 'REST APIs', question: 'Which HTTP method is defined by RFC standards as strictly idempotent?', options: ['POST', 'PUT', 'PATCH (when appending data)', 'CONNECT'], correctIndex: 1, explanation: 'PUT is idempotent because executing identical PUT requests multiple times produces the exact same server state.' },
      { id: 8, topic: 'CSS Layout', question: 'What is the key functional difference between CSS Grid and Flexbox?', options: ['Flexbox is two-dimensional, Grid is one-dimensional', 'Grid is two-dimensional (rows & columns), Flexbox is one-dimensional', 'Flexbox requires JavaScript', 'Grid cannot handle responsive layouts'], correctIndex: 1, explanation: 'CSS Grid is designed for two-dimensional layouts controlling rows and columns simultaneously, while Flexbox is one-dimensional.' },
      { id: 9, topic: 'System Design', question: 'In distributed caching, what is the primary benefit of Consistent Hashing over simple modulo hashing?', options: ['Zero memory allocation', 'Minimizes the number of keys remapped when cache nodes are added or removed', 'Guarantees synchronous cache writes', 'Eliminates cache TTLs entirely'], correctIndex: 1, explanation: 'Consistent hashing remaps only k/n keys on average when a node is added or removed, preventing catastrophic cache invalidation.' },
      { id: 10, topic: 'TypeScript', question: 'What does the TypeScript "keyof" type operator produce when applied to an interface?', options: ['An array of runtime object keys', 'A union type of string or numeric literal keys of the interface', 'A boolean check on property existence', 'A compiler error if strict mode is active'], correctIndex: 1, explanation: 'keyof T produces a union of string or numeric literal types representing all public keys of type T.' },
      { id: 11, topic: 'Networking', question: 'In the TCP 3-way handshake, what flags are sent in sequential order to establish a connection?', options: ['ACK -> SYN -> SYN-ACK', 'SYN -> SYN-ACK -> ACK', 'FIN -> ACK -> FIN-ACK', 'RST -> SYN -> ACK'], correctIndex: 1, explanation: 'The client sends SYN, the server responds with SYN-ACK, and the client acknowledges with ACK.' },
      { id: 12, topic: 'Concurrency', question: 'What is a Race Condition in concurrent software systems?', options: ['When two threads execute faster than the CPU clock', 'When the output of a process depends unexpectedly on the execution order of uncontrolled threads', 'When memory leaks cause garbage collection pauses', 'When network bandwidth is saturated'], correctIndex: 1, explanation: 'A race condition occurs when concurrent operations read and write shared data without synchronization, producing non-deterministic bugs.' },
      { id: 13, topic: 'WebSockets', question: 'How does the WebSocket protocol initiate its connection over standard HTTP?', options: ['Via an HTTP CONNECT proxy tunnel', 'Via an HTTP GET request with "Upgrade: websocket" header', 'Via a UDP broadcast packet', 'Via long-polling JSONP callbacks'], correctIndex: 1, explanation: 'WebSockets begin as an HTTP/1.1 GET request with an Upgrade header; if supported, the server returns 101 Switching Protocols.' },
      { id: 14, topic: 'Memory Management', question: 'What causes a memory leak in a modern Single Page Application (SPA)?', options: ['Uncompressed CSS files', 'Forgotten event listeners, uncleared setInterval timers, or detached DOM nodes retained in closures', 'Using const instead of let', 'Having multiple React state variables'], correctIndex: 1, explanation: 'Memory leaks occur when references to timers, event listeners, or large objects are retained in closures even after components unmount.' },
      { id: 15, topic: 'Database Indexing', question: 'Why does adding too many indexes to a relational database table degrade write (INSERT/UPDATE) performance?', options: ['Indexes consume CPU registers', 'Every write must update both the primary table data and all associated B-Tree index structures', 'Indexes lock the entire database engine', 'Query planner crashes with more than 3 indexes'], correctIndex: 1, explanation: 'While indexes speed up queries, every insert or update must rebalance and write to each index tree, increasing write I/O.' }
    ],
    'AI & Machine Learning': [
      { id: 1, topic: 'Transformers', question: 'In the self-attention mechanism, what are the three primary matrices calculated for each token?', options: ['Weight, Bias, Output', 'Query (Q), Key (K), and Value (V)', 'Encoder, Decoder, Latent', 'Hidden, Cell, State'], correctIndex: 1, explanation: 'Self-attention projects token representations into Query, Key, and Value matrices to calculate dot-product attention weights.' },
      { id: 2, topic: 'Loss Functions', question: 'Which loss function is standard for multi-class classification where classes are mutually exclusive?', options: ['Mean Squared Error (MSE)', 'Categorical Cross-Entropy (Log Loss)', 'Hinge Loss', 'Huber Loss'], correctIndex: 1, explanation: 'Categorical Cross-Entropy measures the dissimilarity between the true one-hot distribution and predicted softmax probabilities.' },
      { id: 3, topic: 'Overfitting', question: 'Which regularization technique randomly zeroes out a fraction of neuron activations during forward propagation?', options: ['Batch Normalization', 'Dropout', 'L2 Ridge Regularization', 'Gradient Clipping'], correctIndex: 1, explanation: 'Dropout deactivates random neurons during training, preventing complex co-adaptations and reducing overfitting.' },
      { id: 4, topic: 'Evaluation Metrics', question: 'When evaluating models on an extremely imbalanced dataset (e.g. 0.1% fraud detection), which metric is most reliable?', options: ['Overall Accuracy', 'Precision-Recall AUC (PR-AUC)', 'Mean Absolute Error', 'Root Mean Squared Error'], correctIndex: 1, explanation: 'Accuracy is misleading on imbalanced datasets because a trivial majority classifier scores high. PR-AUC directly evaluates the positive minority class.' },
      { id: 5, topic: 'Optimization', question: 'Why is the Adam optimizer widely preferred over standard Stochastic Gradient Descent (SGD)?', options: ['It does not require learning rates', 'It combines adaptive learning rates from RMSprop with momentum from Momentum-SGD', 'It only works on convex loss functions', 'It computes second-order Hessian matrices'], correctIndex: 1, explanation: 'Adam computes individual adaptive learning rates for different parameters from estimates of first and second moments of the gradients.' },
      { id: 6, topic: 'Generative AI', question: 'What does RAG stand for in modern LLM architectures?', options: ['Recurrent Attention Generator', 'Retrieval-Augmented Generation', 'Residual Adaptive Gating', 'Rotary Attention Gradient'], correctIndex: 1, explanation: 'Retrieval-Augmented Generation fetches external factual documents from a vector store to ground LLM completions.' },
      { id: 7, topic: 'Model Quantization', question: 'What is the primary benefit of quantizing model weights from FP16 to INT8 or 4-bit?', options: ['Increases parameter count', 'Reduces GPU VRAM consumption and accelerates memory-bandwidth-bound inference', 'Guarantees zero loss in precision', 'Allows training without backpropagation'], correctIndex: 1, explanation: 'Quantization significantly reduces memory footprint and memory bandwidth bottlenecks during LLM token generation.' },
      { id: 8, topic: 'Fine-Tuning', question: 'How does LoRA (Low-Rank Adaptation) achieve parameter-efficient fine-tuning?', options: ['By retraining all weights with smaller learning rates', 'By freezing base weights and injecting low-rank decomposition rank matrices into attention layers', 'By pruning 90% of model layers', 'By training only the tokenizer'], correctIndex: 1, explanation: 'LoRA freezes pre-trained model weights and injects trainable rank decomposition matrices, slashing trainable parameters by 99%.' },
      { id: 9, topic: 'Embeddings', question: 'What mathematical operation is standard for measuring the semantic similarity between two normalized dense vector embeddings?', options: ['Manhattan Distance', 'Cosine Similarity (Dot Product)', 'Hamming Distance', 'Cross-Entropy'], correctIndex: 1, explanation: 'Cosine similarity measures the cosine of the angle between two vectors, invariant to scale for normalized embeddings.' },
      { id: 10, topic: 'Neural Architecture', question: 'What fundamental limitation of RNNs do Transformer architectures overcome?', options: ['Inability to process text', 'Sequential processing bottleneck that prevents parallel training across time steps', 'High floating-point arithmetic cost', 'Inability to use gradient descent'], correctIndex: 1, explanation: 'Transformers use self-attention to process all tokens simultaneously in parallel, overcoming RNN sequential step dependencies.' },
      { id: 11, topic: 'Feature Engineering', question: 'What is Target Encoding for categorical variables, and what is its primary danger?', options: ['Converting to one-hot vectors; danger is memory footprint', 'Replacing categories with the target mean; danger is target leakage and severe overfitting', 'Ordinal integer assignment; danger is scale invariance', 'Hashing categories; danger is collision'], correctIndex: 1, explanation: 'Target encoding replaces category values with average target values; without smoothing or out-of-fold cross-validation, it leads to severe data leakage.' },
      { id: 12, topic: 'Deep Learning', question: 'Why are Residual Connections (skip connections) essential in deep networks like ResNet?', options: ['They eliminate the need for activation functions', 'They provide gradient highways that prevent vanishing gradients during backpropagation', 'They reduce memory usage by half', 'They prevent matrix multiplication'], correctIndex: 1, explanation: 'Skip connections allow gradients to flow directly through the computational graph without degradation, enabling networks with 100+ layers.' },
      { id: 13, topic: 'Data Drift', question: 'What is Concept Drift in production machine learning systems?', options: ['When model weights become corrupted in RAM', 'When the statistical relationship between input features and target outputs changes over time', 'When network latency exceeds 200ms', 'When training datasets have missing columns'], correctIndex: 1, explanation: 'Concept drift occurs when the underlying ground truth pattern being modeled changes in the real world, degrading model accuracy.' },
      { id: 14, topic: 'Ensemble Learning', question: 'What is the key difference between Bagging (e.g. Random Forest) and Boosting (e.g. XGBoost)?', options: ['Bagging trains models sequentially; Boosting trains independently in parallel', 'Bagging trains trees in parallel on bootstrap samples; Boosting trains sequential trees correcting prior errors', 'Bagging only works on regression; Boosting only works on classification', 'Bagging uses deep neural networks; Boosting uses linear models'], correctIndex: 1, explanation: 'Bagging reduces variance by averaging independent parallel trees, while Boosting reduces bias by iteratively training trees on previous residual errors.' },
      { id: 15, topic: 'MLOps', question: 'What is the purpose of an ML Feature Store like Feast?', options: ['To store trained PyTorch model checkpoints', 'To ensure consistent feature transformations between offline training and online real-time inference', 'To track GPU temperature telemetry', 'To serve REST API documentation'], correctIndex: 1, explanation: 'Feature stores prevent train-serve skew by providing a unified feature definitions catalog for both training and low-latency production lookup.' }
    ],
    'Cloud & DevOps Engineering': [
      { id: 1, topic: 'Containers', question: 'In Docker, what is the key difference between an Image and a Container?', options: ['An image is a running process; a container is a static file', 'An image is an immutable template; a container is a running instance with a writable layer', 'Images run on Linux; containers run on Windows', 'Containers cannot share host kernels'], correctIndex: 1, explanation: 'A Docker image is a read-only template with runtime instructions; a container is the runnable stateful instance created from an image.' },
      { id: 2, topic: 'Kubernetes', question: 'What Kubernetes resource manages stateless horizontal scaling and self-healing of identical Pod replicas?', options: ['StatefulSet', 'Deployment (managing ReplicaSet)', 'DaemonSet', 'ConfigMap'], correctIndex: 1, explanation: 'Kubernetes Deployments provide declarative updates and manage ReplicaSets to ensure the desired number of Pod replicas remain healthy.' },
      { id: 3, topic: 'CI/CD Pipelines', question: 'What is a Blue-Green deployment strategy?', options: ['Deploying code to one server at a time until all are updated', 'Maintaining two identical environments, switching traffic to Green once verified', 'Testing code only in staging environments', 'Deploying on weekends only'], correctIndex: 1, explanation: 'Blue-Green maintains two production environments; new code is deployed to Green and live router traffic is cut over instantly.' },
      { id: 4, topic: 'Infrastructure as Code', question: 'What is the primary benefit of declarative IaC tools like Terraform over procedural bash scripts?', options: ['Terraform runs without cloud credentials', 'Terraform defines the desired end state and computes execution plans to reconcile differences', 'Bash is faster for large clusters', 'Terraform does not require state files'], correctIndex: 1, explanation: 'Declarative tools allow you to describe what the infrastructure should look like; the tool automatically calculates the necessary create/update/destroy diff.' },
      { id: 5, topic: 'Observability', question: 'What are the "Three Pillars of Observability" in modern cloud engineering?', options: ['CPU, RAM, and Disk', 'Metrics, Logs, and Distributed Traces', 'Docker, Kubernetes, and Helm', 'Authentication, Authorization, and Auditing'], correctIndex: 1, explanation: 'Metrics (aggregates), Logs (discrete events), and Traces (request path across distributed microservices) constitute the core pillars.' },
      { id: 6, topic: 'Cloud Networking', question: 'What is a CIDR block of /24 in VPC subnet planning?', options: ['A block containing 65,536 IP addresses', 'A block containing 256 total IP addresses (251 usable in AWS)', 'A block containing 16 IP addresses', 'An encrypted VPN tunnel'], correctIndex: 1, explanation: 'A /24 subnet has 32 - 24 = 8 host bits, yielding 2^8 = 256 total IP addresses (AWS reserves 5 for networking purposes).' },
      { id: 7, topic: 'Service Mesh', question: 'What role does an Envoy sidecar proxy play in an Istio service mesh?', options: ['Compiles backend code into binaries', 'Interprets and intercepts all ingress and egress network traffic for mutual TLS, tracing, and rate limiting', 'Replaces Kubernetes DNS server', 'Manages database migrations'], correctIndex: 1, explanation: 'Sidecar proxies run alongside service pods to transparently handle encryption (mTLS), traffic routing, and telemetry.' },
      { id: 8, topic: 'Cloud Security', question: 'What is the Principle of Least Privilege in cloud IAM policy authoring?', options: ['Granting full administrative access to lead engineers', 'Granting identities only the exact permissions strictly required to perform their intended function', 'Never rotating access keys', 'Using password-only authentication'], correctIndex: 1, explanation: 'Least privilege ensures users and service roles have only the minimal permissions needed, mitigating blast radius in security compromises.' },
      { id: 9, topic: 'High Availability', question: 'What is the difference between RTO (Recovery Time Objective) and RPO (Recovery Point Objective)?', options: ['RTO is data loss tolerance; RPO is downtime tolerance', 'RTO is the maximum acceptable downtime; RPO is the maximum acceptable data loss time window', 'RTO applies to storage; RPO applies to compute', 'RTO is for hardware; RPO is for software'], correctIndex: 1, explanation: 'RTO defines how quickly systems must be restored after an outage; RPO defines how much historical data can be lost.' },
      { id: 10, topic: 'Load Balancing', question: 'What is the difference between Layer 4 (L4) and Layer 7 (L7) load balancing?', options: ['L4 is software; L7 is hardware', 'L4 routes on IP and port without inspecting content; L7 routes based on HTTP headers, URLs, and cookies', 'L4 is slower than L7', 'L7 cannot handle HTTPS traffic'], correctIndex: 1, explanation: 'L4 operates at transport level (TCP/UDP); L7 operates at application level, inspecting URL paths, headers, and cookies for intelligent routing.' },
      { id: 11, topic: 'GitOps', question: 'In GitOps frameworks like ArgoCD, what is the single source of truth for cluster state?', options: ['The live Kubernetes etcd database', 'The Git repository containing declarative manifests', 'The developer’s local laptop', 'The cloud provider dashboard'], correctIndex: 1, explanation: 'GitOps mandates that Git repositories are the single source of truth; automated operators pull changes and reconcile live cluster state.' },
      { id: 12, topic: 'Distributed Storage', question: 'What is an S3-compatible Object Storage service optimized for compared to Block Storage (EBS)?', options: ['Low-latency random read/write for operating systems', 'Unstructured data (images, videos, backups) accessed via HTTP REST APIs with high scalability', 'Relational database transaction logs', 'In-memory caching'], correctIndex: 1, explanation: 'Object storage stores unstructured files as blobs with rich metadata accessible via HTTP, offering virtually limitless scale at lower cost.' },
      { id: 13, topic: 'Container Security', question: 'Why should production Docker containers never run as the root user?', options: ['Linux kernels crash if containers use root', 'If a container breakout occurs, the attacker inherits root access privileges on the host node', 'Docker images take longer to download', 'Port binding is impossible'], correctIndex: 1, explanation: 'Running as a non-root UID prevents container breakout vulnerabilities from compromising root privileges on the underlying host OS.' },
      { id: 14, topic: 'DNS & Traffic', question: 'What is a DNS Anycast routing strategy?', options: ['Broadcasting DNS packets to every computer on Earth', 'Assigning the same IP address to multiple geographically distributed servers, routing users to the nearest node via BGP', 'A DNS record for email verification', 'A round-robin DNS technique'], correctIndex: 1, explanation: 'Anycast routes client traffic to the topologically nearest server sharing the same IP address, drastically reducing DNS lookup latency.' },
      { id: 15, topic: 'Secrets Management', question: 'Why should secrets (API keys, DB credentials) never be baked into Docker image layers?', options: ['They slow down image compilation', 'Image layers are cached and inspectable via docker history, exposing credentials to anyone with read access', 'Docker removes keys during build', 'Environment variables do not work in containers'], correctIndex: 1, explanation: 'Docker image layers are permanently recorded; baking secrets into images leaks them to registries and anyone who inspects the layer history.' }
    ],
    'Cybersecurity & Defense': [
      { id: 1, topic: 'Web Vulnerabilities', question: 'In the OWASP Top 10, how do parameterized queries (prepared statements) prevent SQL Injection?', options: ['By encoding input strings as Base64', 'By treating user input strictly as data parameters rather than executable SQL command syntax', 'By disabling SQL syntax on the database', 'By encrypting database tables with AES'], correctIndex: 1, explanation: 'Prepared statements separate the SQL query structure from parameters, ensuring input cannot alter the execution tree.' },
      { id: 2, topic: 'Cryptography', question: 'What is the primary difference between Symmetric and Asymmetric encryption?', options: ['Symmetric is for passwords; Asymmetric is for files', 'Symmetric uses one shared secret key; Asymmetric uses a public-private key pair', 'Symmetric is mathematically unbreakable', 'Asymmetric cannot encrypt data'], correctIndex: 1, explanation: 'Symmetric encryption uses the same key for encryption and decryption; Asymmetric uses a public key to encrypt and private key to decrypt.' },
      { id: 3, topic: 'Authentication', question: 'Why should password hashes always include a unique cryptographic Salt?', options: ['To compress password length', 'To prevent pre-computed Rainbow Table attacks and ensure identical passwords have distinct hashes', 'To make passwords reversible for administrators', 'To speed up bcrypt verification'], correctIndex: 1, explanation: 'Salting adds random data to each password prior to hashing, making precomputed dictionary and rainbow table lookups ineffective.' },
      { id: 4, topic: 'Network Security', question: 'What type of cyberattack is an adversary conducting when they position themselves between a client and an access point to intercept unencrypted traffic?', options: ['Man-in-the-Middle (MITM) / Adversary-in-the-Middle', 'DDoS volumetric amplification', 'Buffer Overflow', 'Directory Traversal'], correctIndex: 0, explanation: 'MITM attacks intercept and potentially alter communication between two parties who believe they are communicating directly.' },
      { id: 5, topic: 'Application Security', question: 'How does the "Same-Origin Policy" (SOP) protect users in web browsers?', options: ['It forces all websites to use HTTPS', 'It prevents scripts on one origin from accessing or manipulating DOM and storage on another origin', 'It blocks cookies from being stored', 'It encrypts local storage'], correctIndex: 1, explanation: 'SOP is a core browser security mechanism that isolates documents loaded from different origins (protocol + domain + port).' },
      { id: 6, topic: 'Zero Trust', question: 'What is the foundational principle of Zero Trust Architecture?', options: ['Trust internal corporate networks by default', 'Never trust, always verify: authenticate and authorize every access request continuously', 'Block all external internet traffic', 'Rely solely on perimeter firewalls'], correctIndex: 1, explanation: 'Zero Trust assumes threats exist both inside and outside the perimeter; every request is authenticated, authorized, and encrypted.' },
      { id: 7, topic: 'Access Control', question: 'What is Cross-Site Request Forgery (CSRF)?', options: ['Stealing passwords via fake login pages', 'Tricking an authenticated user’s browser into sending unauthorized commands to a vulnerable web application', 'Injecting malicious scripts into comments', 'Overloading server RAM with duplicate requests'], correctIndex: 1, explanation: 'CSRF exploits the browser’s automatic inclusion of session cookies to forge actions on behalf of an authenticated victim.' },
      { id: 8, topic: 'Penetration Testing', question: 'What is the difference between Vulnerability Scanning and Penetration Testing?', options: ['Scanning is automated identification of potential flaws; Pen-testing actively exploits weaknesses to assess real impact', 'Scanning is done by hackers; Pen-testing is done by tools', 'Scanning is illegal; Pen-testing is open source', 'Scanning is only for networks'], correctIndex: 0, explanation: 'Vulnerability scanners find known issues automatically; penetration testers simulate real adversary tactics to chain exploits.' },
      { id: 9, topic: 'Public Key Infrastructure', question: 'What role does a Certificate Authority (CA) play in TLS/HTTPS?', options: ['Generates client passwords', 'Cryptographically signs digital certificates to verify that a domain public key legitimately belongs to the site owner', 'Encrypts website databases', 'Inspects HTTP cookies'], correctIndex: 1, explanation: 'CAs act as trusted third parties verifying identity and issuing digital certificates that browsers validate to establish HTTPS.' },
      { id: 10, topic: 'Memory Safety', question: 'What memory corruption vulnerability occurs when input data exceeds allocated stack buffers and overwrites the return address?', options: ['SQL Injection', 'Stack-based Buffer Overflow', 'Server-Side Request Forgery', 'XML External Entity'], correctIndex: 1, explanation: 'Buffer overflows occur when programs write past memory boundaries, potentially hijacking control flow by altering instruction pointers.' },
      { id: 11, topic: 'Cloud Security', question: 'What is SSRF (Server-Side Request Forgery)?', options: ['A client sending forged headers', 'An attacker coercing a vulnerable server to send HTTP requests to internal, non-routable resources (e.g. cloud metadata 169.254.169.254)', 'A DDoS attack on DNS', 'A phishing email campaign'], correctIndex: 1, explanation: 'SSRF tricks a server into making network requests to internal systems or cloud instance metadata services, leaking IAM credentials.' },
      { id: 12, topic: 'Cryptographic Hashing', question: 'Which cryptographic hash function is considered broken for security verification due to practical collision attacks?', options: ['SHA-256', 'MD5 & SHA-1', 'SHA-512', 'BLAKE3'], correctIndex: 1, explanation: 'Both MD5 and SHA-1 have demonstrated mathematical collision attacks and are forbidden in modern security standards.' },
      { id: 13, topic: 'Session Security', question: 'What flags should always be set on sensitive session cookies in production web applications?', options: ['None; cookies are secure by default', 'HttpOnly (prevents JS access), Secure (HTTPS only), and SameSite=Strict/Lax (mitigates CSRF)', 'Max-Age=999999', 'Domain=*'], correctIndex: 1, explanation: 'HttpOnly blocks XSS credential theft, Secure forces HTTPS transmission, and SameSite blocks cross-origin CSRF dispatches.' },
      { id: 14, topic: 'Denial of Service', question: 'What is an amplification DDoS attack (e.g. DNS or NTP amplification)?', options: ['Using multiple keyboards to type faster', 'Sending small requests with spoofed victim source IPs to open reflectors that reply with massive data payloads to the victim', 'Overclocking CPU frequency', 'Brute forcing SSH keys'], correctIndex: 1, explanation: 'Amplification exploits stateless UDP protocols where small queries elicit disproportionately large responses redirected to the victim IP.' },
      { id: 15, topic: 'Incident Response', question: 'What is the primary objective of the "Containment" phase in cybersecurity incident response?', options: ['Blaming the responsible developer', 'Preventing the security breach from spreading further while preserving digital forensics evidence', 'Restoring backups immediately without investigation', 'Deleting all log files'], correctIndex: 1, explanation: 'Containment limits damage and stops lateral adversary movement while preserving volatile memory and network logs for root-cause analysis.' }
    ]
  };

  const currentQuestions = questionBanks[selectedCourse] || questionBanks['Full-Stack Web Engineering'];

  // Session States
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [userAnswers, setUserAnswers] = useState({});
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(900); // 15 mins
  const [toastMessage, setToastMessage] = useState('');

  const currentQ = currentQuestions[currentQIndex];

  // Timer
  useEffect(() => {
    if (quizCompleted) return;
    const interval = setInterval(() => {
      setSecondsLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          setQuizCompleted(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [quizCompleted]);

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const handleSelectCourse = (course) => {
    setSelectedCourse(course);
    setCurrentQIndex(0);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setUserAnswers({});
    setQuizCompleted(false);
    setSecondsLeft(900);
    triggerToast(`Course track updated to "${course}". 15 questions loaded!`);
  };

  const handleSelectOption = (idx) => {
    if (isAnswerSubmitted) return;
    setSelectedOption(idx);
  };

  const handleSubmitAnswer = () => {
    if (selectedOption === null) return;
    setIsAnswerSubmitted(true);
    setUserAnswers(prev => ({ ...prev, [currentQIndex]: selectedOption }));
  };

  const handleNextQuestion = () => {
    if (currentQIndex < currentQuestions.length - 1) {
      setCurrentQIndex(prev => prev + 1);
      const nextChoice = userAnswers[currentQIndex + 1];
      setSelectedOption(nextChoice !== undefined ? nextChoice : null);
      setIsAnswerSubmitted(nextChoice !== undefined);
    } else {
      // Complete quiz
      setQuizCompleted(true);
      const correctCount = Object.entries(userAnswers).filter(([idx, ans]) => {
        return ans === currentQuestions[Number(idx)].correctIndex;
      }).length;

      // Add XP
      const xpEarned = correctCount * 15;
      db.updateUserProfile({
        xp: (currentUser.xp || 1200) + xpEarned,
        quizScore: Math.round((correctCount / currentQuestions.length) * 100)
      });
      triggerToast(`Quiz completed! ${correctCount}/15 Correct. +${xpEarned} XP awarded!`);
    }
  };

  const handleRetake = () => {
    setCurrentQIndex(0);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setUserAnswers({});
    setQuizCompleted(false);
    setSecondsLeft(900);
    triggerToast('Quiz session restarted.');
  };

  const formatTimer = (secs) => {
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return `${mins < 10 ? '0' : ''}${mins}:${rem < 10 ? '0' : ''}${rem}`;
  };

  // Calculate stats on complete
  const correctTotal = Object.entries(userAnswers).filter(([idx, ans]) => {
    return ans === currentQuestions[Number(idx)].correctIndex;
  }).length;
  const percentage = Math.round((correctTotal / currentQuestions.length) * 100);

  return (
    <div className="animate-fade-in flex flex-col gap-lg" style={{ paddingBottom: '5rem' }}>
      {/* Toast Notification */}
      {toastMessage && (
        <div 
          className="glass-panel animate-slide-up"
          style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            zIndex: 99999,
            background: 'rgba(16, 185, 129, 0.95)',
            color: '#fff',
            padding: '10px 18px',
            borderRadius: 'var(--radius-full)',
            boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontWeight: 600,
            fontSize: '0.85rem'
          }}
        >
          <Sparkles size={16} /> {toastMessage}
        </div>
      )}

      {/* ── Top Header & Track Switcher ── */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-md">
        <div>
          <div className="flex items-center gap-xs text-primary font-600 mb-xs" style={{ fontSize: '0.82rem' }}>
            <Award size={14} /> ADAPTIVE COURSE EVALUATION ENGINE
          </div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800, letterSpacing: '-0.3px', margin: '2px 0' }}>
            Daily Technical Assessment: {selectedCourse}
          </h1>
          <p className="text-muted" style={{ fontSize: '0.9rem', margin: 0 }}>
            15 comprehensive questions aligned to your learning course. Solve sequentially to benchmark proficiency.
          </p>
        </div>

        {/* Live Timer Badge */}
        {!quizCompleted && (
          <div className="flex items-center gap-xs glass-panel" style={{ padding: '8px 16px', borderRadius: 'var(--radius-full)', border: '1px solid var(--border-color)' }}>
            <Timer size={16} className={secondsLeft < 180 ? 'text-danger animate-pulse' : 'text-primary'} />
            <span className="tabular-numbers font-mono font-700" style={{ fontSize: '0.92rem' }}>
              {formatTimer(secondsLeft)}
            </span>
          </div>
        )}
      </header>

      {/* ── Course Track Switcher Bar ── */}
      {!quizCompleted && (
        <div className="flex flex-col gap-xs">
          <span className="text-muted font-600" style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Active Learning Course Track
          </span>
          <div className="flex gap-xs overflow-x-auto w-full pb-xs">
            {courseTracks.map(t => (
              <button
                key={t.key}
                onClick={() => handleSelectCourse(t.key)}
                className="skeuo-pill shrink-0 flex items-center gap-xs"
                style={{
                  padding: '7px 16px',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  background: selectedCourse === t.key ? 'var(--primary)' : 'var(--card-bg)',
                  color: selectedCourse === t.key ? '#fff' : 'var(--text-muted)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-full)',
                  cursor: 'pointer'
                }}
              >
                <span>{t.icon}</span>
                <span>{t.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── ACTIVE QUIZ WORKSTATION ── */}
      {!quizCompleted ? (
        <div className="glass-panel p-lg flex flex-col gap-lg" style={{ padding: '2.5rem 2rem', borderRadius: 'var(--radius-lg)' }}>
          {/* Progress Header */}
          <div className="flex justify-between items-center pb-sm" style={{ borderBottom: '1px solid var(--border-color)' }}>
            <span className="badge" style={{ background: 'rgba(99, 102, 241, 0.12)', color: 'var(--primary)', padding: '4px 12px', borderRadius: '4px', fontSize: '0.78rem', fontWeight: 700 }}>
              Question {currentQIndex + 1} of {currentQuestions.length} • {currentQ.topic}
            </span>
            <span className="text-muted" style={{ fontSize: '0.8rem' }}>
              Progress: {Math.round(((currentQIndex + 1) / currentQuestions.length) * 100)}%
            </span>
          </div>

          {/* Progress Bar */}
          <div style={{ height: 6, background: 'var(--input-bg)', borderRadius: 3, overflow: 'hidden' }}>
            <div 
              style={{ 
                width: `${((currentQIndex + 1) / currentQuestions.length) * 100}%`, 
                height: '100%', 
                background: 'linear-gradient(90deg, var(--primary), var(--secondary))',
                transition: 'width 0.3s ease'
              }} 
            />
          </div>

          {/* Question Text */}
          <h2 style={{ fontSize: '1.35rem', fontWeight: 700, lineHeight: 1.45, margin: '8px 0' }}>
            {currentQ.question}
          </h2>

          {/* Options Grid */}
          <div className="flex flex-col gap-sm">
            {currentQ.options.map((option, idx) => {
              const isSelected = selectedOption === idx;
              const isCorrect = currentQ.correctIndex === idx;

              let btnBg = 'var(--input-bg)';
              let borderCol = 'var(--border-color)';
              let textCol = 'var(--text-main)';

              if (isAnswerSubmitted) {
                if (isCorrect) {
                  btnBg = 'rgba(16, 185, 129, 0.15)';
                  borderCol = 'var(--success)';
                  textCol = 'var(--success)';
                } else if (isSelected && !isCorrect) {
                  btnBg = 'rgba(239, 68, 68, 0.15)';
                  borderCol = 'var(--danger)';
                  textCol = 'var(--danger)';
                }
              } else if (isSelected) {
                btnBg = 'rgba(99, 102, 241, 0.12)';
                borderCol = 'var(--primary)';
              }

              return (
                <div
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  className="glass-panel interactive flex items-center justify-between p-md cursor-pointer transition-all"
                  style={{
                    padding: '14px 18px',
                    borderRadius: '12px',
                    background: btnBg,
                    border: `1px solid ${borderCol}`,
                    color: textCol
                  }}
                >
                  <div className="flex items-center gap-sm">
                    <span 
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: '50%',
                        background: isSelected ? 'var(--primary)' : 'rgba(255,255,255,0.06)',
                        color: isSelected ? '#fff' : 'var(--text-muted)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.8rem',
                        fontWeight: 700
                      }}
                    >
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span style={{ fontSize: '0.92rem', fontWeight: 500 }}>{option}</span>
                  </div>

                  {isAnswerSubmitted && isCorrect && <CheckCircle2 size={18} className="text-success" />}
                  {isAnswerSubmitted && isSelected && !isCorrect && <XCircle size={18} className="text-danger" />}
                </div>
              );
            })}
          </div>

          {/* Explanation Banner on Submit */}
          {isAnswerSubmitted && (
            <div 
              className="glass-panel p-md animate-fade-in flex flex-col gap-xs"
              style={{
                background: selectedOption === currentQ.correctIndex ? 'rgba(16, 185, 129, 0.08)' : 'rgba(239, 68, 68, 0.08)',
                border: `1px solid ${selectedOption === currentQ.correctIndex ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
                borderRadius: 'var(--radius-md)'
              }}
            >
              <div className="flex items-center gap-xs font-700" style={{ fontSize: '0.85rem', color: selectedOption === currentQ.correctIndex ? 'var(--success)' : 'var(--danger)' }}>
                {selectedOption === currentQ.correctIndex ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
                <span>{selectedOption === currentQ.correctIndex ? 'Correct Answer!' : 'Incorrect Answer'}</span>
              </div>
              <p style={{ margin: 0, fontSize: '0.84rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                {currentQ.explanation}
              </p>
            </div>
          )}

          {/* Action Row */}
          <div className="flex justify-between items-center pt-md" style={{ borderTop: '1px solid var(--border-color)' }}>
            <span className="text-muted" style={{ fontSize: '0.8rem' }}>
              {selectedOption === null ? 'Select an answer above' : isAnswerSubmitted ? 'Click Next to continue' : 'Click Submit to inspect answer'}
            </span>

            {!isAnswerSubmitted ? (
              <button
                className="btn btn-primary"
                disabled={selectedOption === null}
                onClick={handleSubmitAnswer}
                style={{ width: 'auto', padding: '10px 24px', fontSize: '0.86rem' }}
              >
                Submit Answer
              </button>
            ) : (
              <button
                className="btn btn-primary flex items-center gap-xs"
                onClick={handleNextQuestion}
                style={{ width: 'auto', padding: '10px 24px', fontSize: '0.86rem' }}
              >
                <span>{currentQIndex === currentQuestions.length - 1 ? 'View Final Results' : 'Next Question'}</span>
                <ArrowRight size={15} />
              </button>
            )}
          </div>
        </div>
      ) : (
        /* ── QUIZ RESULTS & FULL QUESTION REVIEW ── */
        <div className="flex flex-col gap-lg animate-fade-in">
          {/* Top Score Summary Banner */}
          <div 
            className="glass-panel flex flex-col md:flex-row justify-between items-start md:items-center gap-lg"
            style={{
              padding: '2.5rem 2rem',
              background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.12), rgba(6, 182, 212, 0.05))',
              border: '1px solid rgba(99, 102, 241, 0.3)',
              borderRadius: 'var(--radius-lg)'
            }}
          >
            <div>
              <div className="flex items-center gap-xs text-success font-600 mb-xs" style={{ fontSize: '0.82rem' }}>
                <CheckCircle2 size={16} /> ASSESSMENT COMPLETE • {selectedCourse}
              </div>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 800, margin: '4px 0' }}>
                {percentage >= 80 ? 'Mastery Demonstrated! (Top Tier)' : percentage >= 60 ? 'Solid Proficiency Achieved' : 'Fundamentals Need Reinforcement'}
              </h2>
              <p className="text-muted" style={{ fontSize: '0.9rem', margin: 0, maxWidth: '540px' }}>
                You scored {correctTotal} out of {currentQuestions.length} correct ({percentage}% accuracy). Review your responses and study the technical explanations below.
              </p>
            </div>

            {/* Score Dial */}
            <div 
              style={{
                width: 110,
                height: 110,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                boxShadow: '0 8px 30px rgba(99, 102, 241, 0.4)',
                flexShrink: 0
              }}
            >
              <div style={{ fontSize: '2.2rem', fontWeight: 800, lineHeight: 1 }}>{correctTotal}/15</div>
              <div style={{ fontSize: '0.72rem', opacity: 0.9, fontWeight: 700 }}>{percentage}% SCORE</div>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex justify-between items-center flex-wrap gap-sm">
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0 }}>
              Question-by-Question Review & Deep Dive
            </h3>
            <div className="flex items-center gap-xs">
              <button 
                onClick={handleRetake}
                className="btn btn-secondary flex items-center gap-xs"
                style={{ padding: '8px 16px', fontSize: '0.82rem', width: 'auto' }}
              >
                <RotateCcw size={15} /> Retake Assessment
              </button>
              <button 
                onClick={() => navigate('/dashboard')}
                className="btn btn-primary"
                style={{ padding: '8px 20px', fontSize: '0.82rem', width: 'auto' }}
              >
                Back to Dashboard
              </button>
            </div>
          </div>

          {/* Full Question Review List */}
          <div className="flex flex-col gap-md">
            {currentQuestions.map((q, idx) => {
              const userAns = userAnswers[idx];
              const isCorrect = userAns === q.correctIndex;

              return (
                <div 
                  key={q.id}
                  className="glass-panel p-lg flex flex-col gap-sm"
                  style={{
                    padding: '20px',
                    borderRadius: '16px',
                    border: isCorrect ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(239, 68, 68, 0.3)',
                    background: 'var(--card-bg)'
                  }}
                >
                  <div className="flex justify-between items-center">
                    <span className="badge" style={{ background: 'var(--input-bg)', color: 'var(--text-muted)', fontSize: '0.72rem' }}>
                      Question {idx + 1} • {q.topic}
                    </span>
                    <span 
                      className="badge flex items-center gap-xs" 
                      style={{ 
                        background: isCorrect ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.12)', 
                        color: isCorrect ? 'var(--success)' : 'var(--danger)',
                        fontSize: '0.74rem',
                        fontWeight: 700
                      }}
                    >
                      {isCorrect ? <><CheckCircle2 size={13} /> Correct</> : <><XCircle size={13} /> Incorrect</>}
                    </span>
                  </div>

                  <h4 style={{ fontSize: '1.05rem', fontWeight: 700, margin: '4px 0' }}>
                    {q.question}
                  </h4>

                  <div className="flex flex-col gap-xs my-xs">
                    {q.options.map((opt, optIdx) => {
                      const wasChosen = userAns === optIdx;
                      const isRight = q.correctIndex === optIdx;

                      let rowBg = 'transparent';
                      let fontCol = 'var(--text-muted)';
                      let borderStyle = '1px solid transparent';

                      if (isRight) {
                        rowBg = 'rgba(16, 185, 129, 0.12)';
                        fontCol = 'var(--success)';
                        borderStyle = '1px solid var(--success)';
                      } else if (wasChosen && !isRight) {
                        rowBg = 'rgba(239, 68, 68, 0.12)';
                        fontCol = 'var(--danger)';
                        borderStyle = '1px solid var(--danger)';
                      }

                      return (
                        <div 
                          key={optIdx} 
                          className="flex items-center justify-between p-xs px-sm rounded"
                          style={{ background: rowBg, color: fontCol, border: borderStyle, fontSize: '0.84rem' }}
                        >
                          <div className="flex items-center gap-xs">
                            <span style={{ fontWeight: 700 }}>{String.fromCharCode(65 + optIdx)}.</span>
                            <span>{opt}</span>
                          </div>
                          {isRight && <span className="text-success font-700 text-xs">✓ Correct Answer</span>}
                          {wasChosen && !isRight && <span className="text-danger font-700 text-xs">✗ Your Selection</span>}
                        </div>
                      );
                    })}
                  </div>

                  {/* Explanation */}
                  <div className="glass-panel p-sm mt-xs" style={{ background: 'var(--input-bg)', borderRadius: 'var(--radius-sm)' }}>
                    <span className="text-primary font-700 block mb-1" style={{ fontSize: '0.78rem' }}>Conceptual Breakdown:</span>
                    <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                      {q.explanation}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
}
