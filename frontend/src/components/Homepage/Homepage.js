"use client";
import Image from "next/image";
import Link from "next/link";
import links from "@/utils/Links";
import { Libre_Baskerville } from "next/font/google";
import { useDarkModeContext } from "@/contexts/DarkModeContext";
import "./Homepage.css";

export const libre_baskerville = Libre_Baskerville({
  weight: ["400", "700"],
  subsets: ["latin"],
});

export function HomePage({ children }) {
  const [darkMode] = useDarkModeContext();
  let darkModeString = "";

  darkModeString = darkMode && " bg-dark-primary text-white ";

  let accordionItemClasses = "accordion-item " + darkModeString;

  return (
    <main className="homepage-negative-margin-top">
      <div className="position-relative h-700">
        <div className="h-100 w-100 background-shadow position-absolute"></div>
        <Image
          priority={true}
          className="hero-image position-absolute"
          src="/images/hero-background.jpg"
          width="0"
          height="700"
          alt="desk to write on"
          sizes="100vw"
        />
        <div className="container h-100">
          <div className="pt-5 text-white d-flex flex-column justify-content-center align-items-center h-100">
            <div className="mb-5 text-center">
              <h1
                className={
                  "mb-3 fw-bold hero-3d display-5 " +
                  libre_baskerville.className
                }
              >
                Find meaning in writing
              </h1>
              <h4>A Website to consume and produce articles...</h4>
            </div>
            <div>
              <div>
                <Link href={links.createAnArticle}>
                  <button className="btn btn-secondary border border-2 border-secondary btn-xl call-to-action">
                    <i className="bi bi-pencil-fill mx-2"></i> Start Your
                    Journey
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="container mt-3">
        {children}
        <h1 className="text-center"> Some Questions You Might Ask</h1>
        <div className="accordion" id="accordionFlick">
          <div className={accordionItemClasses}>
            <h2 className="accordion-header">
              <button
                className={
                  "accordion-button " +
                  (darkMode && "bg-dark-primary text-white")
                }
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#collapseOne"
                aria-expanded="true"
                aria-controls="collapseOne"
              >
                <h2 className="m-0">What can I do in this website?</h2>
              </button>
            </h2>
            <div
              id="collapseOne"
              className="accordion-collapse collapse show"
              data-bs-parent="#accordionFlick"
            >
              <div className="accordion-body">
                You can read, create, edit and delete articles, like articles,
                follow each other, comment on articles, get notified on actions,
                see most liked articles, send and receive private messages.
                However, to perform actions other than reading, you must have an
                account. You can create an account or login via your Google
                account.
              </div>
            </div>
          </div>
          <div className={accordionItemClasses}>
            <h2 className="accordion-header">
              <button
                className={
                  "accordion-button collapsed " +
                  (darkMode && "bg-dark-primary text-white")
                }
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#collapseTwo"
                aria-expanded="false"
                aria-controls="collapseTwo"
              >
                <h2 className="m-0">Why should I use this website?</h2>
              </button>
            </h2>
            <div
              id="collapseTwo"
              className="accordion-collapse collapse"
              data-bs-parent="#accordionFlick"
            >
              <div className="accordion-body">
                Why question can be thought provoking question. Why should one
                do anything? Answer to this question changes from person to
                person. But If you are interested in written communication and
                sharing ideas in that manner, you should use this website.
              </div>
            </div>
          </div>
          <div className={accordionItemClasses}>
            <h2 className="accordion-header">
              <button
                className={
                  "accordion-button collapsed " +
                  (darkMode && "bg-dark-primary text-white")
                }
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#collapseThree"
                aria-expanded="false"
                aria-controls="collapseThree"
              >
                <h2 className="m-0">Why do you display most liked articles?</h2>
              </button>
            </h2>
            <div
              id="collapseThree"
              className="accordion-collapse collapse"
              data-bs-parent="#accordionFlick"
            >
              <div className="accordion-body">
                I chose to include most liked articles in my website structure
                because I thought it can give some form of rating that people
                can use in their decision making when choosing articles to read.
                Choosing which articles to read and engage with can be
                challenging and average opinion can be a metric in that matter.
                It is like Imdb rating. It can help you choose a movie but It
                might not necessarily guarantee that you will like the movie. It
                is a rating tool.
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
