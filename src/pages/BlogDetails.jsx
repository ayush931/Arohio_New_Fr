// src/pages/BlogDetails.jsx
import { NavLink } from "react-router-dom";
import { useEffect } from "react";

export default function BlogDetails() {
    useEffect(() => {
        window.scrollTo(0, 0);
        document.title = "The Ultimate Guide to Effective Project Management • Blog";
    }, []);

    return (
        <div className="container-xxl py-4 py-md-5">
            <style>{`
        /* --- layout + type (left aligned, pro look) --- */
        .bd-crumbs { font-size:.85rem; color:#6b7280; }
        .bd-title { font-weight:800; line-height:1.2; margin-bottom:.25rem; }
        .bd-sub { color:#6b7280; }
        .bd-article { color:#111827; font-size:1rem; }
        .bd-article p { margin: 0 0 1rem 0; }
        .bd-article h2 { margin:1.25rem 0 .5rem; font-size:1.125rem; }
        .bd-article ul, .bd-article ol { padding-left:1.25rem; margin-bottom:1rem; }
        .bd-hero { border-radius:.5rem; overflow:hidden; }
        .bd-hero img { width:100%; height:360px; object-fit:cover; display:block; }
        .bd-hero figcaption { color:#6b7280; font-size:.8rem; padding-top:.5rem; }
        .bd-inline-figure { margin:1rem 0; border-radius:.5rem; overflow:hidden; }
        .bd-inline-figure img { width:100%; height:260px; object-fit:cover; display:block; }
        .bd-inline-figure .cap { font-size:.8rem; color:#6b7280; margin-top:.35rem; }
        .bd-avatar { width:36px; height:36px; border-radius:999px; object-fit:cover }
        .bd-author-avatar { width:52px; height:52px; border-radius:999px; object-fit:cover }
        .bd-aside .card-title { font-size:.95rem; font-weight:700; }
        .bd-aside .mini-thumb { width:72px; height:56px; object-fit:cover; border-radius:.35rem }
        .tag { font-size:.75rem; padding:.25rem .6rem; background:#f1f5f9; border-radius:999px; display:inline-block; }
        .tag + .tag { margin-left:.35rem }
        .card.shadow-sm { box-shadow:0 6px 22px rgba(0,0,0,.06)!important; }
        .bd-related .card img { width:100%; height:130px; object-fit:cover; border-top-left-radius:.5rem; border-top-right-radius:.5rem }
        .btn-teal { background:#12b981; color:#fff; }
        .btn-teal:hover { background:#0ea371; color:#fff; }
        @media (min-width: 1200px){
          .bd-title { font-size:2rem; }
        }
      `}</style>

            {/* Breadcrumbs */}
            <nav className="bd-crumbs mb-3" aria-label="breadcrumb">
                <ol className="breadcrumb m-0">
                    <li className="breadcrumb-item">
                        <NavLink to="/" className="text-decoration-none">Home</NavLink>
                    </li>
                    <li className="breadcrumb-item">
                        <NavLink to="/blog" className="text-decoration-none">Resources</NavLink>
                    </li>
                    <li className="breadcrumb-item">
                        <span>Project Management</span>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                        The Ultimate Guide to Effective Project Management
                    </li>
                </ol>
            </nav>

            <div className="row g-4">
                {/* MAIN */}
                <main className="col-12 col-lg-8">
                    {/* Title + meta */}
                    <header className="mb-2 text-start">
                        <h1 className="bd-title">The Ultimate Guide to Effective Project Management</h1>
                        <div className="d-flex flex-wrap align-items-center gap-3 mt-2 bd-sub">
                            <div className="d-flex align-items-center gap-2 small">
                                <img className="bd-avatar" src="https://i.pravatar.cc/72?img=31" alt="Sophia Carter" />
                                <span className="fw-medium">Sophia Carter</span>
                                <span>•</span>
                                <time>January 24, 2025</time>
                                <span>•</span>
                                <span>8 min read</span>
                            </div>
                            <div className="ms-auto d-flex align-items-center gap-2">
                                <button className="btn btn-sm btn-outline-light border text-muted" title="Share on X">
                                    <i className="fa-brands fa-x-twitter"></i>
                                </button>
                                <button className="btn btn-sm btn-outline-light border text-muted" title="Share on LinkedIn">
                                    <i className="fa-brands fa-linkedin-in"></i>
                                </button>
                                <button
                                    className="btn btn-sm btn-outline-light border text-muted"
                                    title="Copy link"
                                    onClick={() => navigator.clipboard.writeText(window.location.href)}
                                >
                                    <i className="fa-solid fa-link"></i>
                                </button>
                            </div>
                        </div>
                    </header>

                    {/* Hero (fixed height) */}
                    <figure className="bd-hero mb-3">
                        <img
                            src="https://images.unsplash.com/photo-1545235617-9465d2a55698?q=80&w=1400&auto=format&fit=crop"
                            alt="Minimal desk with frames and plants"
                        />
                        <figcaption className="mt-1">A minimal workspace keeps planning focused.</figcaption>
                    </figure>

                    {/* TOC */}
                    <aside className="small border rounded p-3 mb-4 text-start">
                        <div className="fw-semibold mb-2 text-uppercase opacity-75">Table of Contents</div>
                        <ul className="list-unstyled m-0">
                            <li><a className="text-decoration-none" href="#intro">Introduction</a></li>
                            <li><a className="text-decoration-none" href="#what-is-pm">What is Project Management?</a></li>
                            <li><a className="text-decoration-none" href="#principles">Key Principles</a></li>
                            <li><a className="text-decoration-none" href="#lifecycle">Project Lifecycle</a></li>
                            <li><a className="text-decoration-none" href="#tooling">Tooling & Automation</a></li>
                            <li><a className="text-decoration-none" href="#reporting">Reporting Cadence</a></li>
                            <li><a className="text-decoration-none" href="#conclusion">Conclusion</a></li>
                        </ul>
                    </aside>

                    {/* Article (longer + inline images) */}
                    <article className="bd-article text-start">
                        <section id="intro" className="mb-3">
                            <p className="lead">
                                Effective project management helps teams ship on time, within budget, and with clarity.
                                This guide compiles field-tested patterns you can adopt immediately—useful for both
                                startup sprints and large cross-functional programs.
                            </p>
                            <p>
                                You’ll learn how to define outcomes, reduce risk early, and keep stakeholders aligned
                                with lightweight rituals that scale with your team.
                            </p>
                        </section>

                        <figure className="bd-inline-figure">
                            <img
                                src="https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&w=1400&q=80"
                                alt="Planning board with sticky notes"
                            />

                            <div className="cap">Visual planning ensures everyone sees priorities at a glance.</div>
                        </figure>

                        <section id="what-is-pm" className="mb-3">
                            <h2>What is Project Management?</h2>
                            <p>
                                Project management is the discipline of initiating, planning, executing, controlling,
                                and closing work to achieve goals within constraints. The core ingredients are scope,
                                time, cost, quality, risk, and communication.
                            </p>
                        </section>

                        <section id="principles" className="mb-3">
                            <h2>Key Principles</h2>
                            <ul>
                                <li><strong>Clear objectives:</strong> measurable outcomes and acceptance criteria.</li>
                                <li><strong>Sequencing:</strong> focus on one thin vertical slice at a time.</li>
                                <li><strong>Visibility:</strong> single source of truth for scope, timeline, and risks.</li>
                                <li><strong>Feedback loops:</strong> regular demos, retros, and decision logs.</li>
                                <li><strong>Risk-first planning:</strong> make uncertainties explicit and owned.</li>
                            </ul>
                        </section>

                        <figure className="bd-inline-figure">
                            <img
                                src="https://images.unsplash.com/photo-1552581234-26160f608093?q=80&w=1400&auto=format&fit=crop"
                                alt="Team standup meeting"
                            />
                            <div className="cap">Short standups keep momentum without heavy meetings.</div>
                        </figure>

                        <section id="lifecycle" className="mb-3">
                            <h2>Project Lifecycle</h2>
                            <ol>
                                <li>Initiation & discovery</li>
                                <li>Planning & resourcing</li>
                                <li>Execution in vertical slices</li>
                                <li>Monitoring & control</li>
                                <li>Closure & retrospective</li>
                            </ol>
                            <p>
                                Each phase benefits from explicit checkpoints and cadence agreements to keep
                                stakeholders aligned and risks contained.
                            </p>
                        </section>

                        <section id="tooling" className="mb-3">
                            <h2>Tooling & Automation</h2>
                            <p>
                                Prefer light automation over heavy process: CI checks, performance budgets, accessibility
                                linters, and a living spec. Use dashboards that surface risks and deltas rather than vanity metrics.
                            </p>
                        </section>

                        <figure className="bd-inline-figure">
                            <img
                                src="https://picsum.photos/id/1027/1200/800"
                                alt="Laptop with charts"
                            />
                            <div className="cap">Dashboards highlight risk trends and unblock faster decisions.</div>
                        </figure>

                        <section id="reporting" className="mb-3">
                            <h2>Reporting Cadence</h2>
                            <p>
                                Adopt a weekly rhythm: demo, summarize decisions, update risk register, and share ETA deltas.
                                Keep reports concise (1 page) and link to artifacts for detail.
                            </p>
                        </section>

                        <section id="conclusion" className="mb-4">
                            <h2>Conclusion</h2>
                            <p>
                                Great delivery is a habit. Start small, shorten feedback cycles, and iterate on your process
                                as deliberately as you iterate on your product.
                            </p>
                        </section>
                    </article>

                    {/* About the Author */}
                    <section className="card border-0 shadow-sm p-3 p-md-4 mb-4">
                        <div className="d-flex align-items-start gap-3">
                            <img className="bd-author-avatar" src="https://i.pravatar.cc/96?img=31" alt="Sophia Carter" />
                            <div>
                                <h3 className="h6 m-0">Sophia Carter</h3>
                                <p className="text-muted small mb-2">Project coach & product practitioner with 10+ years’ experience.</p>
                                <p className="mb-0 small">
                                    Sophia helps teams ship better software by clarifying scope, building healthy rituals,
                                    and keeping stakeholders aligned without extra meetings.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Related Posts */}
                    <section className="bd-related">
                        <h3 className="h6 fw-bold mb-2">Related Posts</h3>
                        <div className="row g-3">
                            <div className="col-12 col-sm-6 col-lg-4">
                                <div className="card border-0 shadow-sm h-100">
                                    <img src="https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=1000&auto=format&fit=crop" alt="" />
                                    <div className="card-body">
                                        <div className="small text-muted mb-1">Team Communication</div>
                                        <div className="fw-semibold">5 Tips for Effective Team Communication</div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-12 col-sm-6 col-lg-4">
                                <div className="card border-0 shadow-sm h-100">
                                    <img src="https://picsum.photos/id/1043/1000/700" alt="" />
                                    <div className="card-body">
                                        <div className="small text-muted mb-1">Risk</div>
                                        <div className="fw-semibold">The Rise of Risk Management in Projects</div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-12 col-sm-6 col-lg-4">
                                <div className="card border-0 shadow-sm h-100">
                                    <img src="https://picsum.photos/id/1050/1000/700" alt="" />
                                    <div className="card-body">
                                        <div className="small text-muted mb-1">Methodology</div>
                                        <div className="fw-semibold">Agile vs. Waterfall: Choosing the Right Methodology</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </main>

                {/* SIDEBAR */}
                <aside className="col-12 col-lg-4 bd-aside">
                    {/* Search */}
                    <div className="mb-3">
                        <input className="form-control" placeholder="Search articles…" />
                    </div>

                    {/* Latest Posts */}
                    <div className="card border-0 shadow-sm mb-3">
                        <div className="card-body text-start">
                            <h3 className="card-title mb-3">Latest Posts</h3>
                            <ul className="list-unstyled m-0">
                                <li className="d-flex gap-2">
                                    <img className="mini-thumb" src="https://picsum.photos/id/1018/900/600" alt="" />
                                    <div className="small">
                                        <div className="fw-semibold">The Future of Work: Trends and Insights</div>
                                        <div className="text-muted">Jan 21, 2025</div>
                                    </div>
                                </li>
                                <li className="d-flex gap-2 mt-2">
                                    <img className="mini-thumb" src="https://picsum.photos/id/1025/900/600" alt="" />
                                    <div className="small">
                                        <div className="fw-semibold">Minimize Burnout with Better Collaboration</div>
                                        <div className="text-muted">Jan 15, 2025</div>
                                    </div>
                                </li>
                                <li className="d-flex gap-2 mt-2">
                                    <img className="mini-thumb" src="https://picsum.photos/id/1035/900/600" alt="" />
                                    <div className="small">
                                        <div className="fw-semibold">Building a High-Performing Team</div>
                                        <div className="text-muted">Jan 10, 2025</div>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Categories */}
                    <div className="card border-0 shadow-sm mb-3">
                        <div className="card-body">
                            <h3 className="card-title mb-2">Categories</h3>
                            <ul className="list-unstyled m-0 small">
                                <li className="d-flex justify-content-between"><span>Strategy</span><span>116</span></li>
                                <li className="d-flex justify-content-between"><span>Team Collaboration</span><span>103</span></li>
                                <li className="d-flex justify-content-between"><span>Product</span><span>98</span></li>
                                <li className="d-flex justify-content-between"><span>Leadership</span><span>89</span></li>
                                <li className="d-flex justify-content-between"><span>Research</span><span>74</span></li>
                            </ul>
                        </div>
                    </div>

                    {/* Popular Tags */}
                    <div className="card border-0 shadow-sm mb-3">
                        <div className="card-body">
                            <h3 className="card-title mb-2">Popular Tags</h3>
                            <div className="d-flex flex-wrap gap-2">
                                <span className="tag">Agile</span>
                                <span className="tag">Scrum</span>
                                <span className="tag">Planning</span>
                                <span className="tag">Teams</span>
                                <span className="tag">Risk</span>
                                <span className="tag">Stakeholders</span>
                                <span className="tag">Time management</span>
                            </div>
                        </div>
                    </div>

                    {/* Featured Resource */}
                    <div className="card border-0 shadow-sm">
                        <div className="card-body text-center">
                            <h3 className="h6 fw-bold mb-2">Free Resource</h3>
                            <p className="text-muted small">Download our checklist for better project planning.</p>
                            <button className="btn btn-teal btn-sm">Download PDF</button>
                        </div>
                    </div>

                </aside>
            </div>
        </div>
    );
}
