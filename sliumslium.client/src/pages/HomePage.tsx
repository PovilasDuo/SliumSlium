import { JobOffer } from "../api/apiModel";
import { Endpoint } from "../api/endpoints";
import useFetch from "../api/useDataFetching";
import JobOfferCard from "../components/JobOfferCard";

export default function HomePage() {
  const { data } = useFetch<JobOffer[]>(Endpoint.JOB_OFFER);

  return (
    <>
      <div className="container mt-5">
        <h1 className="text-center">Job Offers</h1>
        {data &&
          data.map((offer, index) => (
            <JobOfferCard key={index} offer={offer} />
          ))}
      </div>
    </>
  );
}
