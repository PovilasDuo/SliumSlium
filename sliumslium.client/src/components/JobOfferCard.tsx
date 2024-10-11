import { JobOffer } from "../api/apiModel";

interface JobOfferProps {
  offer: JobOffer;
}

export default function JobOfferCard({ offer }: JobOfferProps) {
  const experienceLevels = ["Entry Level", "Mid Level", "Senior Level"];
  const progressBarWidth = (offer.experienceLevel + 1) * 50;

  return (
    <div className="card mb-4">
      <div className="card-body">
        <div className="row">
          <div className="col">
            <h5 className="card-title">
              <i className="fas fa-briefcase"></i> {offer.name}
            </h5>
            <h6 className="card-subtitle mb-2 text-muted">
              {offer.companyName}
            </h6>
          </div>
          <div className="col">
            <p className="card-text">
              <strong>
                <i className="fas fa-dollar-sign"></i> Salary:
              </strong>{" "}
              ${offer.salary}
            </p>
            <p className="card-text">
              <strong>
                <i className="fas fa-map-marker-alt"></i> Location:
              </strong>{" "}
              {offer.location}
            </p>
            <p className="card-text">
              <strong>
                <i className="fas fa-star"></i> Experience Level:
              </strong>
              <div className="progress">
                <div
                  className={`progress-bar ${
                    progressBarWidth === 100
                      ? "bg-success"
                      : progressBarWidth >= 50
                      ? "bg-warning"
                      : "bg-danger"
                  }`}
                  role="progressbar"
                  style={{ width: `${progressBarWidth}%` }}
                  aria-valuenow={offer.experienceLevel}
                  aria-valuemin={1}
                  aria-valuemax={2}
                ></div>
              </div>
              <span>{experienceLevels[offer.experienceLevel]}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
