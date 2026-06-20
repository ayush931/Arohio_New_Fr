export default function SkeletonWrapper({ loading, children }) {

  if (!loading) return children;

  return (
    <div className="container py-5">

      <div className="placeholder-glow mb-4">
        <span className="placeholder col-6 mb-3"></span>
        <span className="placeholder col-4"></span>
      </div>

      <div className="row g-4">

        {[1,2,3,4,5,6].map((i)=>(
          <div className="col-md-4" key={i}>
            <div className="card border-0 shadow-sm p-4">

              <div className="placeholder-glow">

                <span className="placeholder col-7 mb-3"></span>

                <span className="placeholder col-12 mb-2"></span>
                <span className="placeholder col-10 mb-2"></span>
                <span className="placeholder col-6"></span>

              </div>

            </div>
          </div>
        ))}

      </div>

    </div>
  );
}