// ==========================================

        // 1. DATA PAYLOAD & SPA ROOT DATA VIEWS

        // ==========================================

        const views = {

            home: `

                <div class="stagger-in bento-grid">

                    <!-- Bento Card 1: Main Introduction (Visual Split Grid) -->

                    <div class="glass-card bento-card hero-card interactable" style="animation: glassReveal 0.6s var(--ease-glide) forwards;">

                        <div class="bento-avatar-wrapper">

                            <div class="photo-placeholder">

                                <img src="./profile.png" alt="Shubham R. Vishwakarma" style="width:100%; height:100%; object-fit:cover; border-radius:50%;">

                            </div>

                            <div class="hero-title-group">

                                <div class="section-label" style="margin-bottom:0.35rem; color: var(--accent-cyan);">ACTIVE_RESEARCH // SILICON_UNIVERSITY</div>

                                <h1>Shubham Rajesh Vishwakarma</h1>

                                <div class="mono" style="color: var(--accent-cyan); font-weight:500; font-size:0.75rem;">4th-Year B.Tech Student &mdash; Rust & Solana Web3 Intern</div>

                            </div>

                        </div>

                        <p class="hero-text" style="color: var(--text-primary); font-size: 0.98rem; margin: 0.5rem 0;">

                            I am a 4th-year Computer Science & Engineering student at Silicon University. My current focus is an internship advancing with <strong style="color: var(--accent-cyan); font-weight: 600;">Rust and its systems applications specifically under Solana</strong>. I bridge high-throughput blockchain networks, parallel concurrency scripts, and embedded IoT firmware to build fast, robust, and clean digital systems.

                        </p>

                        

                        <!-- High-Fidelity Typographic Statement with Glowing Cyber Gradient -->

                        <div class="hero-editorial-statement" style="margin: 1.25rem 0; text-align: left;">

                            <h2 style="font-size: clamp(1.28rem, 3.2vw, 1.65rem); font-weight: 800; line-height: 1.4; letter-spacing: -0.02em; margin: 0; background: linear-gradient(135deg, #ffffff 10%, #a855f7 60%, #0ea5e9 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; filter: drop-shadow(0 2px 10px rgba(168, 85, 247, 0.15));">

                                Building resilient, memory-safe systems where concurrent backend control loops meet highly responsive user experiences.

                            </h2>

                        </div>





                        <div style="display:flex; gap:0.75rem; align-items:center; margin-top: 0.25rem; flex-wrap:wrap;">

                            <button class="epic-btn interactable" onclick="renderSPA('artifacts')"><i class="fa-solid fa-code"></i>View Featured Projects</button>

                            <button class="epic-btn btn-purple interactable" onclick="renderSPA('resume')"><i class="fa-solid fa-file-pdf"></i>View Resume</button>

                        </div>

                    </div>



                    <!-- Bento Card 2: Expose Technical Skill Sets Separated by Domain Context (How, Why, Where) -->

                    <div class="glass-card bento-card matrix-card" style="animation: glassReveal 0.7s var(--ease-glide) forwards;">

                        <div class="matrix-tabs">

                            <button class="matrix-tab-btn active" onclick="switchMatrixTab(this, 'web3')">Web3 & Rust</button>

                            <button class="matrix-tab-btn" onclick="switchMatrixTab(this, 'iot')">Embedded IoT</button>

                            <button class="matrix-tab-btn" onclick="switchMatrixTab(this, 'web')">Full-Stack</button>

                        </div>

                        

                        <div id="matrix-pane" class="matrix-content-panel">

                            <!-- Populated dynamically via JS -->

                        </div>

                    </div>



                    <!-- Bento Card 3: Engineering Philosophy (Human-Centered Philosophy Card) -->

                    <div class="glass-card bento-card philosophy-card" style="animation: glassReveal 0.8s var(--ease-glide) forwards;">

                        <div>

                            <div class="section-label">Core Philosophy</div>

                            <h3>Engineering Focus</h3>

                        </div>

                        <div style="margin: 1rem 0;">

                            <div class="philosophy-item">

                                <h4>Hardware-Aware Software</h4>

                                <p>Writing optimized software that respects actual hardware constraints (memory margins, CPU threads, ESP32 footprints).</p>

                            </div>

                            <div class="philosophy-item" style="margin-top:0.85rem;">

                                <h4>Parallel Architectures</h4>

                                <p>Leveraging Rust multi-core task scheduling to execute file scans and data searches concurrently.</p>

                            </div>

                            <div class="philosophy-item" style="margin-top:0.85rem;">

                                <h4>Intuitive Frontends</h4>

                                <p>Packaging heavy underlying logic into clean, responsive user interfaces designed with strict layout fidelity.</p>

                            </div>

                        </div>

                        <div class="mono" style="font-size:0.7rem; color:var(--text-muted); border-top:1px dashed rgba(255,255,255,0.04); padding-top:0.75rem;">

                            Quality over noise // Structure over speed

                        </div>

                    </div>



                    <!-- Bento Card 4: Verified Credentials -->

                    <div class="glass-card bento-card credentials-card" style="animation: glassReveal 0.9s var(--ease-glide) forwards;">

                        <div class="section-label">Certifications</div>

                        <h3>Professional Credentials</h3>

                        <div class="cred-list">

                            <div class="cred-item">

                                <div class="cred-info">

                                    <div class="cred-icon"><i class="fa-solid fa-graduation-cap"></i></div>

                                    <div class="cred-details">

                                        <h4>NPTEL Elite: Blockchain and its Applications</h4>

                                        <p>Credential Registry // CS34S852500573</p>

                                    </div>

                                </div>

                            </div>



                            <div class="cred-item">

                                <div class="cred-info">

                                    <div class="cred-icon"><i class="fa-solid fa-eye"></i></div>

                                    <div class="cred-details">

                                        <h4>NPTEL: Computer Vision and Image Processing</h4>

                                        <p>Credential Registry // EE31S1152500717</p>

                                    </div>

                                </div>

                            </div>



                            <div class="cred-item">

                                <div class="cred-info">

                                    <div class="cred-icon"><i class="fa-brands fa-rust"></i></div>

                                    <div class="cred-details">

                                        <h4>Blockchain With Rust</h4>

                                        <p>Silicon Institute of Technology // SIT</p>

                                    </div>

                                </div>

                            </div>

                            

                            <!-- Hidden list of additional certifications -->

                            <div id="more-certs" style="display: none; flex-direction: column; gap: 0.85rem; margin-top: 0.85rem; animation: paneFade 0.4s var(--ease-glide) forwards;">

                                <div class="cred-item">

                                    <div class="cred-info">

                                        <div class="cred-icon"><i class="fa-solid fa-palette"></i></div>

                                        <div class="cred-details">

                                            <h4>Graphic Designing</h4>

                                            <p>NIIT Foundation</p>

                                        </div>

                                    </div>

                                </div>



                                <div class="cred-item">

                                    <div class="cred-info">

                                        <div class="cred-icon"><i class="fa-solid fa-file-word"></i></div>

                                        <div class="cred-details">

                                            <h4>Microsoft: Work Smarter with Word</h4>

                                            <p>Microsoft Academy</p>

                                        </div>

                                    </div>

                                </div>

                            </div>

                        </div>

                        

                        <button class="epic-btn interactable" id="view-more-certs-btn" onclick="toggleMoreCertificates()" style="margin-top: 1.25rem; width: 100%; justify-content: center;">

                            <i class="fa-solid fa-chevron-down" style="margin-right:6px;"></i>View More Certifications

                        </button>

                    </div>

                </div>

            `,



            experience: `

                <div class="stagger-in page-copy">

                    <div class="section-label">Engineering Journey</div>

                    <h2>Professional Timeline</h2>

                    <p style="margin-bottom: 2rem; max-width:650px;">A detailed timeline of active Web3 research, low-level firmware engineering, and visual web deployments.</p>

                    

                    <div class="timeline-container">

                        <div class="timeline-line"></div>

                        

                        <!-- Solana & Rust Intern -->

                        <div class="timeline-node" style="animation: fadeIn 0.5s var(--ease-glide) forwards;">

                            <div class="timeline-indicator"></div>

                            <div class="glass-card timeline-card">

                                <div class="timeline-date-badge">Jun 2025 - Present</div>

                                <h3>Research Intern: Rust & Solana Web3 Systems</h3>

                                <div class="timeline-org">Silicon University (Computer Science Lab)</div>

                                <div class="timeline-domain-indicator d-web3">Web3, Blockchain & Rust Concurrency</div>

                                

                                <div class="timeline-meta-box">

                                    <div class="timeline-meta-col">

                                        <label>Where (Context)</label>

                                        <span>4th-Year Research capstone, Silicon University Web3 Lab.</span>

                                    </div>

                                    <div class="timeline-meta-col">

                                        <label>Why & How</label>

                                        <span>Rust provides safe multi-core memory management; Solana enables fast ledgers.</span>

                                    </div>

                                </div>



                                <ul class="timeline-bullets">

                                    <li>Advancing with Rust compilation pipelines, focusing on memory allocation bounds and high-throughput thread concurrency.</li>

                                    <li>Developing and testing Solidity and Rust programs compiled for high-speed blockchain network environments.</li>

                                    <li>Studying Solana Virtual Machine (SVM) program parameters and cryptographic key architectures.</li>

                                </ul>

                                <div class="tag-group">

                                    <span class="tag">Solana VM</span>

                                    <span class="tag">Rust systems</span>

                                    <span class="tag">Concurrency</span>

                                    <span class="tag">Anchor Smart Contracts</span>

                                </div>

                            </div>

                        </div>



                        <!-- Web Developer -->

                        <div class="timeline-node" style="animation: fadeIn 0.6s var(--ease-glide) forwards;">

                            <div class="timeline-indicator"></div>

                            <div class="glass-card timeline-card">

                                <div class="timeline-date-badge">Jul 2025 - Aug 2025</div>

                                <h3>Web Developer</h3>

                                <div class="timeline-org">Nekhkhilesh Technologies Pvt. Ltd. (Corporate Web Project)</div>

                                <div class="timeline-domain-indicator d-web">Frontend & Web Constructs</div>

                                

                                <div class="timeline-meta-box">

                                    <div class="timeline-meta-col">

                                        <label>Where (Context)</label>

                                        <span>Corporate Footprint Setup (<a href="https://nehkhileshtechnologies.com/" target="_blank" rel="noopener noreferrer" class="timeline-link">Click to visit website</a>).</span>

                                    </div>

                                    <div class="timeline-meta-col">

                                        <label>Why & How</label>

                                        <span>Next.js for optimized SSR/SEO, Three.js WebGL for visual client engagement.</span>

                                    </div>

                                </div>



                                <ul class="timeline-bullets">

                                    <li>Delivered the corporate web platform, incorporating custom Three.js assets and React Hooks.</li>

                                    <li>Built clean, highly responsive layout modules using React Hooks, TypeScript, and Tailwind CSS.</li>

                                    <li>Provisioned hosting files, DNS record configurations, and secure SMTP contact mail pipelines.</li>

                                    <li>Executed maintenance routines to optimize core client-side performance markers.</li>

                                </ul>

                                <div class="tag-group">

                                    <span class="tag">Next.js</span>

                                    <span class="tag">Three.js</span>

                                    <span class="tag">TypeScript</span>

                                    <span class="tag">Tailwind CSS</span>

                                </div>

                            </div>

                        </div>



                        <!-- VisiLock -->

                        <div class="timeline-node" style="animation: fadeIn 0.7s var(--ease-glide) forwards;">

                            <div class="timeline-indicator"></div>

                            <div class="glass-card timeline-card">

                                <div class="timeline-date-badge">Aug 2023 - Jun 2024</div>

                                <h3>Embedded Firmware & Web Integrator</h3>

                                <div class="timeline-org">VisiLock (Biometric entrance System Project)</div>

                                <div class="timeline-domain-indicator d-iot">Embedded Hardware & IoT</div>

                                

                                <div class="timeline-meta-box">

                                    <div class="timeline-meta-col">

                                        <label>Where (Context)</label>

                                        <span>Independent hardware prototype engineered for high-security corridors.</span>

                                    </div>

                                    <div class="timeline-meta-col">

                                        <label>Why & How</label>

                                        <span>ESP32 microcontrollers for cost-efficiency, C++ firmware for direct hardware controls.</span>

                                    </div>

                                </div>



                                <ul class="timeline-bullets">

                                    <li>Programmed C++ based ESP32 firmware logic, designing facial biometric validation loops.</li>

                                    <li>Integrated WebSocket pipelines to broadcast validation updates dynamically onto local dashboard maps.</li>

                                    <li>Constructed secure front-end panels allowing administrators to trigger real-time, remote overrides.</li>

                                </ul>

                                <div class="tag-group">

                                    <span class="tag">ESP32 Firmware</span>

                                    <span class="tag">Embedded C++</span>

                                    <span class="tag">Biometrics</span>

                                    <span class="tag">WebSockets</span>

                                </div>

                            </div>

                        </div>



                        <!-- Biotez -->

                        <div class="timeline-node" style="animation: fadeIn 0.8s var(--ease-glide) forwards;">

                            <div class="timeline-indicator"></div>

                            <div class="glass-card timeline-card">

                                <div class="timeline-date-badge">Jun 2024 - Aug 2024</div>

                                <h3>Project In-Charge cum Coordinator</h3>

                                <div class="timeline-org">Biotez Agrinovation Pvt. Ltd. (Operations)</div>

                                <div class="timeline-domain-indicator d-web">Operations & Supply Systems</div>

                                

                                <div class="timeline-meta-box">

                                    <div class="timeline-meta-col">

                                        <label>Where (Context)</label>

                                        <span>Biotez agricultural supply chains and field logistics.</span>

                                    </div>

                                    <div class="timeline-meta-col">

                                        <label>Why & How</label>

                                        <span>Systematic planning and resource mapping to prevent scheduling bottlenecks.</span>

                                    </div>

                                </div>



                                <ul class="timeline-bullets">

                                    <li>Coordinated field teams and oversaw procurement routes for core technical deliverables.</li>

                                    <li>Formulated strategic communication bridges to smooth vendor interactions.</li>

                                    <li>Tracked execution parameters to secure scheduled milestone deployment.</li>

                                </ul>

                            </div>

                            </div>

                        </div>

                    </div>

                </div>

            `,



            artifacts: `

                <div class="stagger-in page-copy">

                    <div class="section-label">Featured Projects</div>

                    <h2>Selected Mappings & Open Source</h2>

                    <p style="margin-bottom: 1.5rem; max-width:650px;">Explore projects organized by their engineering domain. Select a domain below to filter blueprints.</p>

                    

                    <!-- Interactive Domain Filters -->

                    <div class="archive-filters">

                        <button class="archive-filter-btn active interactable" onclick="filterProjects('all', this)">[ All Domains ]</button>

                        <button class="archive-filter-btn interactable" onclick="filterProjects('web3', this)">[ Web3 & Rust Concurrency ]</button>

                        <button class="archive-filter-btn interactable" onclick="filterProjects('iot', this)">[ Embedded Hardware & IoT ]</button>

                        <button class="archive-filter-btn interactable" onclick="filterProjects('web', this)">[ Full-Stack UI ]</button>

                    </div>



                    <div class="archive-grid" id="project-archive-grid">

                        <!-- Project 1 -->

                        <div class="glass-card archive-card interactable" data-proj-domain="iot" style="animation: glassReveal 0.5s var(--ease-glide) forwards;">

                            <div class="archive-header">

                                <span class="archive-badge active">Embedded Hardware</span>

                                <div class="archive-icon"><i class="fa-solid fa-microchip"></i></div>

                            </div>

                            <div>

                                <h3>The VisiLock Apparatus</h3>

                                <p style="color:var(--text-muted);">A keyless entrance system integrating facial biometric scanning on ESP32 microcontrollers, linked to secure WebSocket override dashboards.</p>

                                <div class="archive-meta-block">

                                    <div class="archive-meta-row"><label>Where</label><span>Independent Hardware Core</span></div>

                                    <div class="archive-meta-row"><label>Why</label><span>Eliminate key loss in healthcare systems</span></div>

                                    <div class="archive-meta-row"><label>How</label><span>ESP32 + C++ firmware + WebSockets</span></div>

                                </div>

                            </div>

                            <div class="archive-footer">

                                <div class="mono" style="font-size:0.72rem; color:var(--text-muted);">C++ // ESP32 // WebSockets</div>

                                <a href="https://github.com/dynexian/visiLock-smart-face-access" target="_blank" class="cred-link interactable">Repository <i class="fa-solid fa-arrow-up-right-from-square"></i></a>

                            </div>

                        </div>



                        <!-- Project 2 -->

                        <div class="glass-card archive-card interactable" data-proj-domain="web3" style="animation: glassReveal 0.6s var(--ease-glide) forwards;">

                            <div class="archive-header">

                                <span class="archive-badge web3">Rust Concurrency</span>

                                <div class="archive-icon"><i class="fa-brands fa-rust"></i></div>

                            </div>

                            <div>

                                <h3>The Rayon Purge</h3>

                                <p style="color:var(--text-muted);">A high-velocity file deduplication CLI scraper. Utilizes parallel path scanning and SHA256 hashes to quarantine duplicates concurrently.</p>

                                <div class="archive-meta-block">

                                    <div class="archive-meta-row"><label>Where</label><span>Independent CLI Systems Utility</span></div>

                                    <div class="archive-meta-row"><label>Why</label><span>Speed up redundant data scans</span></div>

                                    <div class="archive-meta-row"><label>How</label><span>Rust + Rayon multi-core scheduler</span></div>

                                </div>

                            </div>

                            <div class="archive-footer">

                                <div class="mono" style="font-size:0.72rem; color:var(--text-muted);">Rust // Rayon // Concurrency</div>

                                <a href="https://github.com/dynexian" target="_blank" class="cred-link interactable">Repository <i class="fa-solid fa-arrow-up-right-from-square"></i></a>

                            </div>

                        </div>



                        <!-- Project 3 -->

                        <div class="glass-card archive-card interactable" data-proj-domain="web3" style="animation: glassReveal 0.7s var(--ease-glide) forwards;">

                            <div class="archive-header">

                                <span class="archive-badge web3">Web3 Protocol</span>

                                <div class="archive-icon"><i class="fa-solid fa-cubes"></i></div>

                            </div>

                            <div>

                                <h3>EduTech DAO Smart Contract</h3>

                                <p style="color:var(--text-muted);">A decentralized education funding protocol programmed in Solidity. Supports MetaMask deposits, token distribution, and voting panels.</p>

                                <div class="archive-meta-block">

                                    <div class="archive-meta-row"><label>Where</label><span>Web3 Solidity Capstone Project</span></div>

                                    <div class="archive-meta-row"><label>Why</label><span>Transparent school resources pools</span></div>

                                    <div class="archive-meta-row"><label>How</label><span>Solidity + Sepolia Testnet + Ethers.js</span></div>

                                </div>

                            </div>

                            <div class="archive-footer">

                                <div class="mono" style="font-size:0.72rem; color:var(--text-muted);">Solidity // Ethers.js // Web3</div>

                                <a href="https://github.com/dynexian/dao-funding-dapp" target="_blank" class="cred-link interactable">Repository <i class="fa-solid fa-arrow-up-right-from-square"></i></a>

                            </div>

                        </div>



                        <!-- Project 4 -->

                        <div class="glass-card archive-card interactable" data-proj-domain="iot" style="animation: glassReveal 0.8s var(--ease-glide) forwards;">

                            <div class="archive-header">

                                <span class="archive-badge active">Telemetry Node</span>

                                <div class="archive-icon"><i class="fa-solid fa-wind"></i></div>

                            </div>

                            <div>

                                <h3>Project Vayuraksha</h3>

                                <p style="color:var(--text-muted);">A smart air monitoring micro-node. Captures environmental sensor telemetries and automatically modulates filtration hardware flow speed dynamically.</p>

                                <div class="archive-meta-block">

                                    <div class="archive-meta-row"><label>Where</label><span>EDP Capstone Hardware Build</span></div>

                                    <div class="archive-meta-row"><label>Why</label><span>Environmental tracking in work setups</span></div>

                                    <div class="archive-meta-row"><label>How</label><span>Sensor arrays + C++ firmware loops</span></div>

                                </div>

                            </div>

                            <div class="archive-footer">

                                <div class="mono" style="font-size:0.72rem; color:var(--text-muted);">Sensors // Embedded C // Telemetry</div>

                                <span class="mono" style="color:var(--accent-gold); font-size:0.72rem;">Hardware Build</span>

                            </div>

                        </div>



                        <!-- Project 5 -->

                        <div class="glass-card archive-card interactable" data-proj-domain="web" style="animation: glassReveal 0.9s var(--ease-glide) forwards;">

                            <div class="archive-header">

                                <span class="archive-badge active">Full-Stack Web</span>

                                <div class="archive-icon"><i class="fa-solid fa-globe"></i></div>

                            </div>

                            <div>

                                <h3>Nekhkhilesh Corporate Platform</h3>

                                <p style="color:var(--text-muted);">The official corporate digital hub. Integrates interactive, GPU-driven Three.js WebGL scenes, secure lead capture endpoints, and automatic SMTP routing pipelines.</p>

                                <div class="archive-meta-block">

                                    <div class="archive-meta-row"><label>Where</label><span>Nekhkhilesh Technologies Pvt. Ltd.</span></div>

                                    <div class="archive-meta-row"><label>Why</label><span>Establish authority & lead capturing</span></div>

                                    <div class="archive-meta-row"><label>How</label><span>React + Next.js + Three.js + Tailwind CSS</span></div>

                                </div>

                            </div>

                            <div class="archive-footer">

                                <div class="mono" style="font-size:0.72rem; color:var(--text-muted);">Next.js // Three.js // React // SMTP</div>

                                <a href="https://nehkhileshtechnologies.com/" target="_blank" class="cred-link interactable">Live Site <i class="fa-solid fa-arrow-up-right-from-square"></i></a>

                            </div>

                            </div>

                        </div>

                    </div>

                </div>

            `,



            resume: `

                <div class="stagger-in resume-view">

                    <!-- Actions Menu -->

                    <div style="display:flex; justify-content:flex-end; gap:0.75rem; margin-bottom: 2rem;" class="no-print">

                        <a href="./resume_print.html" target="_blank" rel="noopener noreferrer" class="epic-btn btn-purple interactable" style="text-decoration:none;"><i class="fa-solid fa-arrow-up-right-from-square"></i>Printable Version (A4)</a>

                        <button class="epic-btn interactable" onclick="window.print()"><i class="fa-solid fa-print"></i>Print / Save PDF</button>

                    </div>



                    <div class="glass-card" style="padding: 3rem; animation: glassReveal 0.6s var(--ease-glide) forwards;">

                        <header class="resume-header">

                            <div class="resume-personal">

                                <div class="mono" style="color: var(--accent-cyan); font-weight:600; margin-bottom:0.45rem;">// PROFESSIONAL RESUME</div>

                                <h1>Shubham Rajesh Vishwakarma</h1>

                                <p style="font-size:1.05rem; color:var(--text-primary); font-weight:500;">Software Engineer &bull; Solana Web3 Developer</p>

                                <div class="resume-contact-bar">

                                    <span><i class="fa-solid fa-envelope" style="margin-right:6px;"></i><a href="mailto:vishwakarmashubham2004@gmail.com" class="interactable">vishwakarmashubham2004@gmail.com</a></span>

                                    <span><i class="fa-solid fa-location-dot" style="margin-right:6px;"></i>Bhubaneswar / Rourkela, India</span>

                                    <span><i class="fa-brands fa-github" style="margin-right:6px;"></i><a href="https://github.com/dynexian" target="_blank" class="interactable">github.com/dynexian</a></span>

                                </div>

                            </div>

                            <div class="photo-placeholder no-print">

                                <img src="./profile.png" alt="Shubham R. Vishwakarma" style="width:100%; height:100%; object-fit:cover; border-radius:50%;">

                            </div>

                        </header>



                        <div class="resume-layout-grid">

                            <!-- Left Sidebar Column (Profile, Education, Skills, Certifications) -->

                            <div class="resume-sidebar-col">

                                <section class="resume-section">

                                    <h2>Profile</h2>

                                    <p style="font-size: 0.88rem; color: var(--text-muted); line-height: 1.6; margin:0;">

                                        Currently a 4th-Year Computer Science & Engineering student at Silicon University doing a specialized research internship advancing with Rust and Solana Web3 systems. I map complex distributed ledgers, low-level concurrency schedules, and embedded C++ microcontrollers into highly optimized, clean architectures.

                                    </p>

                                </section>



                                <section class="resume-section">

                                    <h2>Education</h2>

                                    <div class="resume-timeline-item" style="margin-bottom: 1.25rem;">

                                        <h4 style="font-size: 0.95rem; margin:0 0 0.2rem 0; color:var(--text-primary);">B.Tech: CSE (AI/ML)</h4>

                                        <div style="font-size:0.8rem; color:var(--accent-gold); margin-bottom:0.15rem; font-family:'Fira Code',monospace;">2024 &mdash; Present (Ongoing)</div>

                                        <div style="font-size: 0.8rem; color: var(--text-muted); line-height:1.3;">Silicon Institute of Technology</div>

                                    </div>

                                    <div class="resume-timeline-item">

                                        <h4 style="font-size: 0.95rem; margin:0 0 0.2rem 0; color:var(--text-primary);">Diploma: IT (86%)</h4>

                                        <div style="font-size:0.8rem; color:var(--accent-gold); margin-bottom:0.15rem; font-family:'Fira Code',monospace;">2022 &mdash; 2024</div>

                                        <div style="font-size: 0.8rem; color: var(--text-muted); line-height:1.3;">SKDAV Govt. Polytechnic</div>

                                    </div>

                                </section>



                                <section class="resume-section">

                                    <h2>Skills Loadout</h2>

                                    <div style="display:flex; flex-direction:column; gap:0.85rem;">

                                        <div>

                                            <strong style="font-size:0.78rem; font-family:'Fira Code',monospace; color:var(--text-primary); display:block; margin-bottom:0.35rem;">Web3 & Systems:</strong>

                                            <div class="tag-group" style="margin-top:0;">

                                                <span class="tag">Rust</span><span class="tag">Solidity</span><span class="tag">Rayon</span><span class="tag">Anchor</span>

                                            </div>

                                        </div>

                                        <div>

                                            <strong style="font-size:0.78rem; font-family:'Fira Code',monospace; color:var(--text-primary); display:block; margin-bottom:0.35rem;">Embedded & IoT:</strong>

                                            <div class="tag-group" style="margin-top:0;">

                                                <span class="tag">ESP32</span><span class="tag">C++</span><span class="tag">WebSockets</span>

                                            </div>

                                        </div>

                                        <div>

                                            <strong style="font-size:0.78rem; font-family:'Fira Code',monospace; color:var(--text-primary); display:block; margin-bottom:0.35rem;">Frontend & Web:</strong>

                                            <div class="tag-group" style="margin-top:0;">

                                                <span class="tag">Next.js</span><span class="tag">Three.js</span><span class="tag">TypeScript</span>

                                            </div>

                                        </div>

                                    </div>

                                </section>



                                <section class="resume-section">

                                    <h2>Certifications</h2>

                                    <ul style="padding-left:1.1rem; font-size:0.82rem; color:var(--text-muted); display:flex; flex-direction:column; gap:0.45rem; margin:0;">

                                        <li>Blockchain With Rust &mdash; SIT</li>

                                        <li>Blockchain &amp; Applications (Elite) &mdash; NPTEL</li>

                                        <li>Computer Vision &mdash; NPTEL</li>

                                        <li>Graphic Designing &mdash; NIIT</li>

                                        <li>Microsoft: Word Systems</li>

                                    </ul>

                                </section>

                            </div>



                            <!-- Right Core Column (Experience, Key Projects) -->

                            <div class="resume-main-col">

                                <section class="resume-section">

                                    <h2>Experience</h2>

                                    

                                    <div class="resume-timeline-item">

                                        <div class="resume-timeline-header">

                                            <h3>Web3 & Systems Intern (Rust & Solana)</h3>

                                            <span class="resume-timeline-date">Jun 2025 &mdash; Present</span>

                                        </div>

                                        <div class="resume-timeline-org">Silicon University (Web3 Systems Lab)</div>

                                        <ul style="padding-left:1.15rem; font-size:0.88rem; color:var(--text-muted); line-height:1.45;">

                                            <li>Advancing with Rust compilation pipelines, focusing on memory allocation bounds and high-throughput thread concurrency.</li>

                                            <li>Developing and testing Solidity and Rust programs compiled for high-speed blockchain network environments.</li>

                                            <li>Studying Solana Virtual Machine (SVM) program parameters and cryptographic key architectures.</li>

                                        </ul>

                                    </div>



                                    <div class="resume-timeline-item">

                                        <div class="resume-timeline-header">

                                            <h3>Web Developer</h3>

                                            <span class="resume-timeline-date">Jul 2025 &mdash; Aug 2025</span>

                                        </div>

                                        <div class="resume-timeline-org">Nekhkhilesh Technologies Pvt. Ltd.</div>

                                        <ul style="padding-left:1.15rem; font-size:0.88rem; color:var(--text-muted); line-height:1.45;">

                                            <li>Designed, integrated, and deployed the official corporate landing platform (nehkhileshtechnologies.com).</li>

                                            <li>Implemented interactive visual environments incorporating custom Three.js WebGL systems.</li>

                                            <li>Constructed modular layout pages using React Hooks, TypeScript, and Tailwind CSS.</li>

                                            <li>Provisioned hosting structures, nameserver configurations, and SMTP contact routing pipelines.</li>

                                        </ul>

                                    </div>



                                    <div class="resume-timeline-item">

                                        <div class="resume-timeline-header">

                                            <h3>Embedded & Front-end Developer</h3>

                                            <span class="resume-timeline-date">Aug 2023 &mdash; Jun 2024</span>

                                        </div>

                                        <div class="resume-timeline-org">VisiLock (Biometric Access Project)</div>

                                        <ul style="padding-left:1.15rem; font-size:0.88rem; color:var(--text-muted); line-height:1.45;">

                                            <li>Programmed C++ based ESP32 firmware, deploying facial biometric comparison validation loops.</li>

                                            <li>Orchestrated full-stack WebSocket pipelines to broadcast biometric logs onto interactive web panels.</li>

                                            <li>Allowed security overseers to trigger real-time, remote overrides.</li>

                                        </ul>

                                    </div>

                                </section>



                                <section class="resume-section">

                                    <h2>Key Projects</h2>

                                    

                                    <div class="resume-timeline-item">

                                        <div class="resume-timeline-header">

                                            <h3>The Rayon Purge (Rust Concurrency CLI Tool)</h3>

                                            <span class="resume-timeline-date">Standalone Systems Program</span>

                                        </div>

                                        <p style="font-size:0.88rem; color:var(--text-muted); line-height:1.45; margin-top:0.35rem;">

                                            Designed a high-velocity command-line utility to index and delete duplicate system archives. Implemented parallel worker pools using Rayon, scanning paths concurrently, comparing SHA256 hashes, and outputting structured JSON summaries.

                                        </p>

                                    </div>



                                    <div class="resume-timeline-item">

                                        <div class="resume-timeline-header">

                                            <h3>EduTech DAO Smart Contract (Solidity / Sepolia)</h3>

                                            <span class="resume-timeline-date">Web3 Capstone Project</span>

                                        </div>

                                        <p style="font-size:0.88rem; color:var(--text-muted); line-height:1.45; margin-top:0.35rem;">

                                            Constructed an on-chain funding pool on Sepolia Testnet. Enabled community MetaMask deposits, dynamic token minting, and voting parameters, bridging the contract directly onto standard web interfaces.

                                        </p>

                                    </div>

                                </section>

                            </div>

                            </div>

                        </div>

                    </div>

                </div>

            `

        };



        // ==========================================

        // 2. DOMAIN MATRIX INTERACTIVE LOGIC

        // ==========================================

        const matrixData = {

            web3: `

                <div class="matrix-content-panel" style="animation: paneFade 0.4s var(--ease-glide) forwards;">

                    <div>

                        <div class="matrix-meta-row">

                            <label>Domain Focus</label>

                            <span>Web3, Blockchain & Rust Concurrency</span>

                        </div>

                        <div class="matrix-meta-row">

                            <label>Current Context (Where)</label>

                            <span>4th-Year Capstone & Web3 Research Intern @ Silicon University.</span>

                        </div>

                        <div class="matrix-meta-row">

                            <label>Engineering Rationale (Why & How)</label>

                            <p>Rust delivers safe, low-level multi-core concurrency without garbage collection, making it ideal for the high-frequency Solana Virtual Machine (SVM) program loops. Anchor CLI is used to compile smart contract ledger instructions.</p>

                        </div>

                    </div>

                    <div class="tag-group" style="margin-top:0.75rem;">

                        <span class="tag tag-accent">Rust</span>

                        <span class="tag tag-accent">Solana VM</span>

                        <span class="tag tag-accent">Solidity</span>

                        <span class="tag tag-accent">Rayon</span>

                        <span class="tag tag-accent">Anchor</span>

                    </div>

                </div>

            `,

            iot: `

                <div class="matrix-content-panel" style="animation: paneFade 0.4s var(--ease-glide) forwards;">

                    <div>

                        <div class="matrix-meta-row">

                            <label>Domain Focus</label>

                            <span>Embedded Hardware & IoT Systems</span>

                        </div>

                        <div class="matrix-meta-row">

                            <label>Applied Context (Where)</label>

                            <span>VisiLock biometric system & Project Vayuraksha air sensor modules.</span>

                        </div>

                        <div class="matrix-meta-row">

                            <label>Engineering Rationale (Why & How)</label>

                            <p>ESP32 microcontrollers are utilized for cost-efficiency. Embedded C++ firmware enables direct control of physical relays, sensors, and camera pins, while WebSocket protocols broadcast telemetries to admin maps.</p>

                        </div>

                    </div>

                    <div class="tag-group" style="margin-top:0.75rem;">

                        <span class="tag tag-accent">ESP32 Firmware</span>

                        <span class="tag tag-accent">Embedded C++</span>

                        <span class="tag tag-accent">Sensors</span>

                        <span class="tag tag-accent">WebSockets</span>

                        <span class="tag tag-accent">Biometrics</span>

                    </div>

                </div>

            `,

            web: `

                <div class="matrix-content-panel" style="animation: paneFade 0.4s var(--ease-glide) forwards;">

                    <div>

                        <div class="matrix-meta-row">

                            <label>Domain Focus</label>

                            <span>Frontend & Web Constructs</span>

                        </div>

                        <div class="matrix-meta-row">

                            <label>Applied Context (Where)</label>

                            <span>Nekhkhilesh Technologies Pvt. Ltd. (Corporate Web Project).</span>

                        </div>

                        <div class="matrix-meta-row">

                            <label>Engineering Rationale (Why & How)</label>

                            <p>Next.js is selected for optimized Server-Side Rendering and SEO visibility. Three.js leverages client GPUs to render interactive spatial WebGL assets, packaging heavy logic into fluid visual systems.</p>

                        </div>

                    </div>

                    <div class="tag-group" style="margin-top:0.75rem;">

                        <span class="tag tag-accent">Next.js</span>

                        <span class="tag tag-accent">Three.js</span>

                        <span class="tag tag-accent">TypeScript</span>

                        <span class="tag tag-accent">Tailwind CSS</span>

                        <span class="tag tag-accent">React Hooks</span>

                    </div>

                </div>

            `

        };



        function switchMatrixTab(element, domainKey) {

            const tabs = document.querySelectorAll('.matrix-tab-btn');

            tabs.forEach(t => t.classList.remove('active'));

            element.classList.add('active');



            const pane = document.getElementById('matrix-pane');

            if (pane) {

                pane.innerHTML = matrixData[domainKey] || matrixData['web3'];

                bindSpotlights();

            }

        }



        // ==========================================

        // 2B. OUT-OF-THE-BOX SYSTEMS SIMULATION MONITOR

        // ==========================================

        const SystemsMonitor = {

            activeFeed: 'solana',

            intervalId: null,

            slotCounter: 284091,

            logs: {

                solana: [],

                esp32: [],

                rust: []

            },

            

            init() {

                this.logs.solana = [

                    "// Solana Virtual Machine Node Active",

                    "// Listening for SVM Anchor entrypoints",

                    "[INIT] Epoch 612 active",

                    "[INFO] Core ledger listener running on SIT port 8899"

                ];

                this.logs.esp32 = [

                    "// ESP32-WROOM-32E low-level hardware active",

                    "// GPIO initialization successful",

                    "[INIT] WebSocket handler established on port 80",

                    "[INFO] VisiLock biometric relay: Standby"

                ];

                this.logs.rust = [

                    "// cargo check --workspace --release",

                    "// Rayon threadpool initialized: 4 workers",

                    "[INIT] Cryptographic hashing context loaded",

                    "[INFO] deduplicator memory-mapped page-cache active"

                ];

            },

            

            start() {

                this.stop(); // safety

                this.init();

                this.render();

                

                this.intervalId = setInterval(() => {

                    this.tick();

                }, 1500);

            },

            

            stop() {

                if (this.intervalId) {

                    clearInterval(this.intervalId);

                    this.intervalId = null;

                }

            },

            

            switchFeed(feedName) {

                this.activeFeed = feedName;

                this.render();

            },

            

            tick() {

                const feed = this.activeFeed;

                if (feed === 'solana') {

                    this.slotCounter += Math.floor(Math.random() * 3) + 1;

                    const logMsg = `[TX] Slot ${this.slotCounter} verified // Tx count: ${Math.floor(Math.random() * 80) + 12} // gas: 0.000005 SOL`;

                    this.logs.solana.push(logMsg);

                    if (this.logs.solana.length > 5) this.logs.solana.shift();

                } else if (feed === 'esp32') {

                    const wifiSignal = -50 - Math.floor(Math.random() * 20);

                    const coreTemp = (39.5 + Math.random() * 3.5).toFixed(1);

                    const logMsg = `[TELEMETRY] RSSI: ${wifiSignal}dBm // CPU Temp: ${coreTemp}&deg;C // Heap: ${21420 + Math.floor(Math.random()*800)} bytes`;

                    this.logs.esp32.push(logMsg);

                    if (this.logs.esp32.length > 5) this.logs.esp32.shift();

                } else if (feed === 'rust') {

                    const fileCount = Math.floor(Math.random() * 500) + 50;

                    const timeTaken = (0.05 + Math.random() * 0.12).toFixed(3);

                    const threads = [0,1,2,3];

                    const activeThread = threads[Math.floor(Math.random() * threads.length)];

                    const logMsg = `[RUST] Thread ${activeThread} complete: deduped ${fileCount} files in ${timeTaken}s`;

                    this.logs.rust.push(logMsg);

                    if (this.logs.rust.length > 5) this.logs.rust.shift();

                }

                this.render();

            },

            

            render() {

                const container = document.getElementById('monitor-screen-feed');

                if (!container) return;

                

                let html = '';

                

                if (this.activeFeed === 'solana') {

                    html = `

                        <div class="feed-solana" style="animation: paneFade 0.3s var(--ease-glide) forwards;">

                            <div class="slots-visualizer">

                                <span class="mono visualizer-label">Ledger Slots:</span>

                                <div class="slots-grid">

                                    <div class="slot-block active pulsating"></div>

                                    <div class="slot-block active"></div>

                                    <div class="slot-block active"></div>

                                    <div class="slot-block"></div>

                                    <div class="slot-block"></div>

                                    <div class="slot-block"></div>

                                    <div class="slot-block"></div>

                                    <div class="slot-block"></div>

                                </div>

                            </div>

                            <div class="console-logs mono">

                                ${this.logs.solana.map(log => `<div>${log}</div>`).join('')}

                            </div>

                        </div>

                    `;

                } else if (this.activeFeed === 'esp32') {

                    html = `

                        <div class="feed-esp32" style="animation: paneFade 0.3s var(--ease-glide) forwards;">

                            <div class="signals-visualizer">

                                <div class="signal-metric"><span class="mono text-muted">WiFi:</span> <span class="mono text-cyan">CONNECTED</span></div>

                                <div class="signal-metric"><span class="mono text-muted">Pins Status:</span> <div class="pins-row"><span class="pin green">G2</span><span class="pin green">G4</span><span class="pin red">G12</span></div></div>

                                <div class="signal-metric"><span class="mono text-muted">Relay Mode:</span> <span class="mono text-purple">SECURE</span></div>

                            </div>

                            <div class="console-logs mono" style="color: #a78bfa;">

                                ${this.logs.esp32.map(log => `<div>${log}</div>`).join('')}

                            </div>

                        </div>

                    `;

                } else if (this.activeFeed === 'rust') {

                    html = `

                        <div class="feed-rust" style="animation: paneFade 0.3s var(--ease-glide) forwards;">

                            <div class="threads-visualizer">

                                <div class="thread-item"><span class="mono">T0</span><div class="bar-container"><div class="bar-fill rust-fill" style="width: 85%;"></div></div></div>

                                <div class="thread-item"><span class="mono">T1</span><div class="bar-container"><div class="bar-fill rust-fill" style="width: 45%;"></div></div></div>

                                <div class="thread-item"><span class="mono">T2</span><div class="bar-container"><div class="bar-fill rust-fill" style="width: 95%;"></div></div></div>

                                <div class="thread-item"><span class="mono">T3</span><div class="bar-container"><div class="bar-fill rust-fill" style="width: 15%;"></div></div></div>

                            </div>

                            <div class="console-logs mono" style="color: #fda4af;">

                                ${this.logs.rust.map(log => `<div>${log}</div>`).join('')}

                            </div>

                        </div>

                    `;

                }

                

                container.innerHTML = html;

            }

        };



        function switchMonitorFeed(feedName, event) {

            if (event) {

                const buttons = document.querySelectorAll('.monitor-btn');

                buttons.forEach(btn => btn.classList.remove('active'));

                event.currentTarget.classList.add('active');

            }

            SystemsMonitor.switchFeed(feedName);

        }



        // ==========================================

        // 3. PROJECT ARCHIVE DYNAMIC FILTERING

        // ==========================================

        function filterProjects(domain, btnElement) {

            // Update active filter btn

            const filterBtns = document.querySelectorAll('.archive-filter-btn');

            filterBtns.forEach(btn => btn.classList.remove('active'));

            btnElement.classList.add('active');



            const projectGrid = document.getElementById('project-archive-grid');

            if (!projectGrid) return;



            const cards = projectGrid.querySelectorAll('.archive-card');

            

            cards.forEach(card => {

                const projDomain = card.dataset.projDomain;

                

                if (domain === 'all' || projDomain === domain) {

                    card.style.display = 'flex';

                    // Re-trigger animation

                    card.style.animation = 'none';

                    card.offsetHeight; /* trigger reflow */

                    card.style.animation = 'glassReveal 0.5s var(--ease-glide) forwards';

                } else {

                    card.style.display = 'none';

                }

            });

        }



        // ==========================================

        // 4. SPA ROUTER IMPLEMENTATION

        // ==========================================

        const appRoot = document.getElementById('app-root');

        const navLinks = document.querySelectorAll('#nav-links a');

        const mobileLinks = document.querySelectorAll('#mobile-menu a');

        const menuToggle = document.getElementById('menu-toggle');

        const mobileMenu = document.getElementById('mobile-menu');



        function renderSPA(viewName) {

            // Fade out

            appRoot.classList.add('page-fade');

            window.scrollTo({ top: 0, behavior: 'smooth' });

            

            window.setTimeout(() => {

                // Render HTML

                appRoot.innerHTML = views[viewName] || views['home'];

                

                // Update active link state

                const allNavs = [...navLinks, ...mobileLinks];

                allNavs.forEach(link => {

                    if (link.dataset.view === viewName) {

                        link.classList.add('active');

                    } else {

                        link.classList.remove('active');

                    }

                });



                // Fade in

                appRoot.classList.remove('page-fade');

                

                // Triggers & spotlights

                bindSpotlights();

                

                if (viewName === 'home') {

                    // Pre-load default active domain tab

                    const defaultTab = document.querySelector('.matrix-tab-btn');

                    if (defaultTab) switchMatrixTab(defaultTab, 'web3');

                    

                    // Start dynamic systems simulator

                    SystemsMonitor.start();

                } else {

                    // Stop simulator when moving away

                    SystemsMonitor.stop();

                }

            }, 180);

        }



        // Navigation Routing Hooks

        function setupNavigation(links) {

            links.forEach(link => {

                link.addEventListener('click', (e) => {

                    e.preventDefault();

                    const targetView = link.dataset.view;



                    // Close mobile menu if open

                    mobileMenu.classList.remove('active');

                    menuToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';



                    document.body.classList.add('is-transitioning');

                    const finish = () => document.body.classList.remove('is-transitioning');

                    

                    // Cinematic Journey handler

                    if (targetView === 'story') {

                        startJourney();

                        window.setTimeout(finish, 300);

                        return;

                    }



                    // Standard SPA Transition (supports View Transitions API where available)

                    if (!document.startViewTransition) {

                        renderSPA(targetView);

                        window.setTimeout(finish, 300);

                        return;

                    }

                    

                    const transition = document.startViewTransition(() => renderSPA(targetView));

                    transition.finished.finally(finish);

                });

            });

        }



        setupNavigation(navLinks);

        setupNavigation(mobileLinks);



        // Mobile Menu toggle

        menuToggle.addEventListener('click', () => {

            const isActive = mobileMenu.classList.toggle('active');

            menuToggle.innerHTML = isActive ? '<i class="fa-solid fa-xmark"></i>' : '<i class="fa-solid fa-bars"></i>';

        });



        // Initialize Router

        renderSPA('home');



        // ==========================================

        // 5. CINEMATIC ENGINE (JOURNEY SCROLLYTELLING)

        // ==========================================

        const spaContainer = document.getElementById('app-root');

        const navMain = document.getElementById('nav-main');

        const cineEngine = document.getElementById('cinematic-engine');

        const exitBtn = document.getElementById('exit-journey');

        const scrollExplore = document.getElementById('scroll-explore');

        let isCinematic = false;



        function startJourney() {

            isCinematic = true; 

            window.scrollTo(0, 0);

            document.body.classList.add('is-cinematic');

            

            // Fade out explore guide state

            scrollExploreFaded = false;

            

            // Fade out navbar and root

            spaContainer.style.opacity = '0'; 

            navMain.style.transform = 'translateY(-100%)';

            

            setTimeout(() => {

                spaContainer.style.display = 'none'; 

                cineEngine.style.display = 'block'; 

                exitBtn.style.display = 'block';

                scrollExplore.style.display = 'flex';

                scrollExplore.style.opacity = '0.8';

                cineEngine.setAttribute('aria-hidden', 'false');

                document.getElementById('story-chapter').textContent = '01';

                document.getElementById('story-progress-fill').style.transform = 'scaleX(0)';

                document.getElementById('story-percentage').textContent = '0%';

                document.getElementById('void-canvas').style.opacity = '0.15'; // dim dust specs

                

                // Schedule caching via double requestAnimationFrame to guarantee CSS rendering is complete

                requestAnimationFrame(() => {

                    requestAnimationFrame(() => {

                        cacheStoryMetrics();

                        handleStoryScroll();

                    });

                });

            }, 450);

        }



        function exitJourney() {

            isCinematic = false; 

            window.scrollTo(0, 0);

            document.body.classList.remove('is-cinematic');

            cineEngine.setAttribute('aria-hidden', 'true');

            

            cineEngine.style.display = 'none'; 

            exitBtn.style.display = 'none'; 

            scrollExplore.style.display = 'none';

            spaContainer.style.display = 'block';

            

            // Reset active state references

            activeChapterElement = null;

            

            // Reset canvas opacity

            document.getElementById('void-canvas').style.opacity = '1';

            

            // Reactivate active link

            const activeLink = document.querySelector('#nav-links a.active');

            const targetView = activeLink ? activeLink.dataset.view : 'home';

            renderSPA(targetView);



            setTimeout(() => { 

                spaContainer.style.opacity = '1'; 

                navMain.style.transform = 'translateY(0)'; 

            }, 100);

        }



        // CONTINUOUS SCROLL-LINKED PROGRESS & NEBULA PARALLAX

        // Silky-Smooth Cinematic Scroll Engine (GPU-Accelerated, Throttled & Zero-Reflow)

        let cachedStoryShellTop = 0;

        let cachedStoryShellHeight = 0;

        let cachedWindowHeight = 0;

        let cachedChapterTops = {};

        

        // Cache DOM elements in O(1) maps to completely prevent expensive DOM query selectors on high-frequency scroll events

        let cachedStoryCards = {};

        let cachedStoryCopies = {};

        

        let activeChapterElement = null;

        let isScrollPending = false;

        let scrollExploreFaded = false;



        function cacheStoryMetrics() {

            const storyShell = document.querySelector('.story-shell');

            if (!storyShell) return;

            

            cachedStoryShellTop = storyShell.offsetTop;

            cachedStoryShellHeight = storyShell.scrollHeight;

            cachedWindowHeight = window.innerHeight;

            

            const containers = document.querySelectorAll('.story-container');

            containers.forEach((container) => {

                const sticky = container.querySelector('.story-sticky');

                if (sticky) {

                    const chapterNum = sticky.dataset.chapter;

                    cachedChapterTops[chapterNum] = container.offsetTop;

                    

                    // Pre-cache DOM elements for O(1) O(1) constant-time access

                    cachedStoryCards[chapterNum] = sticky.querySelector('.story-card');

                    cachedStoryCopies[chapterNum] = sticky.querySelector('.story-copy');

                }

            });

        }



        function updateStoryScroll() {

            if (!isCinematic) {

                isScrollPending = false;

                return;

            }

            

            // Self-healing check: Recalculate metrics dynamically on scroll if they were caught in a layout reflow race-condition

            if (cachedStoryShellHeight <= cachedWindowHeight) {

                cacheStoryMetrics();

            }

            

            const scrollY = window.scrollY || window.pageYOffset;

            const scrolled = scrollY - cachedStoryShellTop;

            

            // Math.max guarantees positive non-zero divisor to prevent division-by-zero NaN bugs

            const totalHeight = Math.max(1, cachedStoryShellHeight - cachedWindowHeight);

            

            let percent = (scrolled / totalHeight) * 100;

            percent = Math.min(100, Math.max(0, percent));

            

            const progressFill = document.getElementById('story-progress-fill');

            const progressPercent = document.getElementById('story-percentage');

            

            if (progressFill) progressFill.style.transform = `scaleX(${percent / 100})`;

            if (progressPercent) progressPercent.textContent = `${Math.round(percent)}%`;



            // Fade out explore guide on scroll (Throttled layout-free state shift)

            if (percent > 2) {

                if (!scrollExploreFaded) {

                    scrollExploreFaded = true;

                    scrollExplore.style.opacity = '0';

                    scrollExplore.style.pointerEvents = 'none';

                }

            } else {

                if (scrollExploreFaded) {

                    scrollExploreFaded = false;

                    scrollExplore.style.opacity = '0.8';

                    scrollExplore.style.pointerEvents = 'auto';

                }

            }



            // High-end scroll-linked Parallax translations on active elements

            if (activeChapterElement) {

                const chapterNum = activeChapterElement.dataset.chapter;

                const parentTop = cachedChapterTops[chapterNum];

                if (parentTop !== undefined) {

                    // Offset ratio relative to viewport middle (Zero-Reflow Arithmetic)

                    const offset = (parentTop - scrollY) / cachedWindowHeight;

                    

                    // Retrieve DOM references in O(1) constant-time to maintain full 60fps scrolling

                    const storyCard = cachedStoryCards[chapterNum];

                    const storyCopy = cachedStoryCopies[chapterNum];

                    

                    if (storyCard) {

                        storyCard.style.transform = `translateY(${offset * 45}px) translateZ(0)`;

                    }

                    if (storyCopy) {

                        storyCopy.style.transform = `translateY(${offset * -15}px) translateZ(0)`;

                    }

                }

            }

            

            isScrollPending = false;

        }



        function handleStoryScroll() {

            if (!isCinematic) return;

            if (!isScrollPending) {

                isScrollPending = true;

                requestAnimationFrame(updateStoryScroll);

            }

        }



        window.addEventListener('scroll', handleStoryScroll, { passive: true });

        window.addEventListener('resize', () => {

            if (isCinematic) {

                cacheStoryMetrics();

                handleStoryScroll();

            }

        });



        // Intersection Observer for Story Chapters (Caching Active Elements)

        const storyChapter = document.getElementById('story-chapter');

        const storyScenes = Array.from(document.querySelectorAll('.observe-cine'));

        

        const cineObserver = new IntersectionObserver((entries) => {

            entries.forEach(entry => {

                if (entry.isIntersecting) {

                    entry.target.classList.add('is-active');

                    activeChapterElement = entry.target;

                    const chap = entry.target.dataset.chapter;

                    if (storyChapter && chap) {

                        storyChapter.textContent = String(chap).padStart(2, '0');

                        

                        // Dynamically shift the ambient cinematic backing color theme

                        const ambientThemes = {

                            '1': '#090516', // Deep Violet

                            '2': '#030914', // Deep Cyan/Teal

                            '3': '#0c0803', // Deep Gold/Bronze

                            '4': '#020b06'  // Deep Emerald

                        };

                        const cineEngine = document.getElementById('cinematic-engine');

                        if (cineEngine && ambientThemes[chap]) {

                            cineEngine.style.backgroundColor = ambientThemes[chap];

                        }

                    }

                } else {

                    entry.target.classList.remove('is-active');

                    if (activeChapterElement === entry.target) {

                        activeChapterElement = null;

                    }

                }

            });

        }, { threshold: 0.35, rootMargin: '-10% 0px -10% 0px' });



        storyScenes.forEach(el => cineObserver.observe(el));



        // Custom Cursor Precision Toggle

        if (window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {

            document.body.classList.add('custom-cursor');

        }



        // Print Layout triggers - Render synchronously to avoid blank capture in printing engine

        function renderSPASync(viewName) {

            // Render HTML immediately without transitions

            appRoot.innerHTML = views[viewName] || views['home'];

            

            // Update active link state

            const allNavs = [...navLinks, ...mobileLinks];

            allNavs.forEach(link => {

                if (link.dataset.view === viewName) {

                    link.classList.add('active');

                } else {

                    link.classList.remove('active');

                }

            });



            // Ensure transition classes are removed so it prints fully visible

            appRoot.classList.remove('page-fade');

            

            // Triggers & spotlights

            bindSpotlights();

            

            if (viewName === 'home') {

                const defaultTab = document.querySelector('.matrix-tab-btn');

                if (defaultTab) switchMatrixTab(defaultTab, 'web3');

                SystemsMonitor.start();

            } else {

                SystemsMonitor.stop();

            }

        }



        window.addEventListener('beforeprint', () => {

            try { renderSPASync('resume'); } catch (e) {}

        });

        window.addEventListener('afterprint', () => {

            try {

                const active = document.querySelector('#nav-links a.active');

                renderSPA(active ? active.dataset.view : 'home');

            } catch (e) {}

        });



        // ==========================================

        // 6. ADVANCED SPOTLIGHT COORDINATES BINDING

        // ==========================================

        function bindSpotlights() {

            const cards = document.querySelectorAll('.glass-card');

            cards.forEach(card => {

                card.addEventListener('mousemove', (e) => {

                    const rect = card.getBoundingClientRect();

                    const x = e.clientX - rect.left;

                    const y = e.clientY - rect.top;

                    card.style.setProperty('--mouse-x', `${x}px`);

                    card.style.setProperty('--mouse-y', `${y}px`);

                });

            });

        }



        // ==========================================

        // 7. LIGHTWEIGHT RESPONSIVE CUSTOM CURSOR

        // ==========================================

        const cursorElement = document.getElementById('custom-cursor');

        let mouseXCoord = -100, mouseYCoord = -100;

        let currentX = -100, currentY = -100;



        window.addEventListener('mousemove', (e) => {

            mouseXCoord = e.clientX; 

            mouseYCoord = e.clientY;

        });



        // Smooth snapping hover events

        function setupCursorHoverEffects() {

            document.body.addEventListener('mouseover', (e) => {

                const target = e.target.closest('.interactable, a, button, .tag, .cred-item, .matrix-tab-btn, .archive-filter-btn');

                if (target) {

                    document.body.classList.add('hovering-ring');

                }

            });



            document.body.addEventListener('mouseout', (e) => {

                const target = e.target.closest('.interactable, a, button, .tag, .cred-item, .matrix-tab-btn, .archive-filter-btn');

                if (target) {

                    document.body.classList.remove('hovering-ring');

                }

            });

        }

        setupCursorHoverEffects();



        function renderCursors() {

            // Elastic damping algorithm for 60fps tracking

            currentX += (mouseXCoord - currentX) * 0.15; 

            currentY += (mouseYCoord - currentY) * 0.15;

            

            if (cursorElement) {

                cursorElement.style.transform = `translate(calc(${currentX}px - 50%), calc(${currentY}px - 50%))`;

            }

            requestAnimationFrame(renderCursors);

        }

        renderCursors();



        // ==========================================

        // 8. STRIPE-STYLE AMBIENT DUST DRIFT CANVAS

        // ==========================================

        const canvas = document.getElementById('void-canvas');

        const ctx = canvas ? canvas.getContext('2d') : null;

        let width, height, nodes = [];



        // Mouse velocity indicators

        let lastMouseXPos = -1000, lastMouseYPos = -1000;

        let mouseVelocityX = 0, mouseVelocityY = 0;



        window.addEventListener('mousemove', (e) => {

            if (lastMouseXPos === -1000) {

                lastMouseXPos = e.clientX;

                lastMouseYPos = e.clientY;

            }

            mouseVelocityX = e.clientX - lastMouseXPos;

            mouseVelocityY = e.clientY - lastMouseYPos;

            

            lastMouseXPos = e.clientX;

            lastMouseYPos = e.clientY;

        });



        function resizeCanvas() {

            if (!canvas) return;

            width = canvas.width = window.innerWidth;

            height = canvas.height = window.innerHeight;

            initFlowField();

        }

        window.addEventListener('resize', resizeCanvas);



        // Fluid flow field vector equations

        const gridSpacing = 40;

        let cols, rows;

        let flowField = [];



        function initFlowField() {

            cols = Math.ceil(width / gridSpacing) + 1;

            rows = Math.ceil(height / gridSpacing) + 1;

            flowField = new Float32Array(cols * rows * 2);

            for (let i = 0; i < cols * rows; i++) {

                flowField[i * 2] = (Math.random() - 0.5) * 0.1;

                flowField[i * 2 + 1] = (Math.random() - 0.5) * 0.1;

            }

        }



        class FluidParticle {

            constructor() {

                this.reset();

                this.x = Math.random() * width; 

                this.y = Math.random() * height;

            }

            

            reset() {

                this.x = Math.random() * width; 

                this.y = Math.random() * height;

                this.vx = (Math.random() - 0.5) * 0.2; 

                this.vy = (Math.random() - 0.5) * 0.2;

                this.life = 100 + Math.random() * 150;

                this.maxLife = this.life;

                this.color = Math.random() > 0.4 ? 'rgba(139, 92, 246,' : 'rgba(14, 165, 233,'; // violet or cyan

                this.radius = 1 + Math.random() * 1.5;

            }

            

            update() {

                // Get vector coordinate under particle

                const colIdx = Math.floor(this.x / gridSpacing);

                const rowIdx = Math.floor(this.y / gridSpacing);

                

                if (colIdx >= 0 && colIdx < cols && rowIdx >= 0 && rowIdx < rows) {

                    const idx = (rowIdx * cols + colIdx) * 2;

                    this.vx += flowField[idx] * 0.1;

                    this.vy += flowField[idx + 1] * 0.1;

                }



                // Fluid mouse sweeps

                let dx = this.x - mouseXCoord, dy = this.y - mouseYCoord;

                let dist = Math.sqrt(dx*dx + dy*dy);

                

                if (dist < 150) {

                    let force = (150 - dist) / 150;

                    this.vx += mouseVelocityX * force * 0.05;

                    this.vy += mouseVelocityY * force * 0.05;

                }

                

                // Fluid Friction

                this.vx *= 0.96;

                this.vy *= 0.96;

                

                this.x += this.vx; 

                this.y += this.vy;

                this.life--;

                

                if (this.life <= 0 || this.x < 0 || this.x > width || this.y < 0 || this.y > height) {

                    this.reset();

                }

            }

            

            draw() {

                if (!ctx) return;

                const alpha = (this.life / this.maxLife) * 0.45;

                ctx.beginPath(); 

                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);

                ctx.fillStyle = this.color + alpha + ')'; 

                ctx.fill();

            }

        }



        // Initialize particles

        if (canvas) {

            resizeCanvas();

            const count = Math.min(280, Math.floor((width * height) / 3800));

            for (let i = 0; i < count; i++) {

                nodes.push(new FluidParticle());

            }

        }



        function updateFlowField() {

            for (let i = 0; i < cols * rows; i++) {

                const idx = i * 2;

                const nodeX = (i % cols) * gridSpacing;

                const nodeY = Math.floor(i / cols) * gridSpacing;

                

                const dx = nodeX - mouseXCoord;

                const dy = nodeY - mouseYCoord;

                const dist = Math.sqrt(dx*dx + dy*dy);

                

                if (dist < 160) {

                    const force = (160 - dist) / 160;

                    flowField[idx] += mouseVelocityX * force * 0.02;

                    flowField[idx + 1] += mouseVelocityY * force * 0.02;

                }

                

                // Baseline grid node decay

                flowField[idx] *= 0.95;

                flowField[idx + 1] *= 0.95;

            }

            // Decay mouse velocity

            mouseVelocityX *= 0.88;

            mouseVelocityY *= 0.88;

        }



        function renderCanvasFrame() {

            if (!ctx || !canvas) return;

            

            // Elite alpha-erasure trails trick (preserves layout transparency)

            ctx.globalCompositeOperation = 'destination-out';

            ctx.fillStyle = 'rgba(0, 0, 0, 0.09)';

            ctx.fillRect(0, 0, width, height);

            ctx.globalCompositeOperation = 'source-over';

            

            updateFlowField();

            

            // Constellation line linkage for ink currents

            for (let i = 0; i < nodes.length; i++) {

                for (let j = i + 1; j < nodes.length; j++) {

                    let dx = nodes[i].x - nodes[j].x;

                    let dy = nodes[i].y - nodes[j].y;

                    let dist = Math.sqrt(dx*dx + dy*dy);

                    

                    if (dist < 80) {

                        ctx.beginPath(); 

                        ctx.moveTo(nodes[i].x, nodes[i].y); 

                        ctx.lineTo(nodes[j].x, nodes[j].y);

                        

                        const lineAlpha = (1 - (dist / 80)) * 0.12 * (nodes[i].life / nodes[i].maxLife);

                        ctx.strokeStyle = `rgba(139, 92, 246, ${lineAlpha})`; 

                        ctx.lineWidth = 0.65;

                        ctx.stroke();

                    }

                }

            }

            

            nodes.forEach(node => { 

                node.update(); 

                node.draw(); 

            });

            

            requestAnimationFrame(renderCanvasFrame);

        }

        

        if (canvas) {

            renderCanvasFrame();

        }



        // ==========================================

        // 10. DYNAMIC CERTIFICATIONS TOGGLE LIST

        // ==========================================

        function toggleMoreCertificates() {

            const moreCerts = document.getElementById('more-certs');

            const btn = document.getElementById('view-more-certs-btn');

            if (!moreCerts || !btn) return;

            

            if (moreCerts.style.display === 'none') {

                moreCerts.style.display = 'flex';

                btn.innerHTML = '<i class="fa-solid fa-chevron-up" style="margin-right:6px;"></i>Collapse List';

            } else {

                moreCerts.style.display = 'none';

                btn.innerHTML = '<i class="fa-solid fa-chevron-down" style="margin-right:6px;"></i>View More Certifications';

            }

        }