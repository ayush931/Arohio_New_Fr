export default function TrustedBySection({ trusted_by }) {
    if (!trusted_by) return null;

    return (
        <div className="text-center mt-4">

            <div className="text-muted small mb-2">
                {trusted_by?.title || "TRUSTED BY"}
            </div>

            <div className="d-flex justify-content-center align-items-center gap-3 trusted-avatars">

                {(trusted_by?.avatars || []).map((src, i) => (
                    <img
                        key={`${src}-${i}`}
                        loading="lazy"
                        className="trusted-avatar"
                        src={src}
                        alt={`Trusted avatar ${i + 1}`}
                    />
                ))}

            </div>

        </div>
    );
}