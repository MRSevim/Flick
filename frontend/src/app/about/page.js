import Link from "next/link";
import links from "@/utils/Links";
import { envVariables } from "@/utils/HelperFuncs";
import "./About.css";

export const metadata = {
  title: "About",
  description: "About page of " + envVariables.websiteName,
};

const page = () => {
  return (
    <div className="container position-relative">
      <svg
        className="position-absolute top-0 end-0 z-n1"
        xmlns="http://www.w3.org/2000/svg"
        width="200"
        height="200"
        fillRule="evenodd"
        strokeLinejoin="round"
        strokeMiterlimit="2"
        clipRule="evenodd"
        viewBox="0 0 24 24"
        opacity="0.05"
      >
        <path
          id="Icon"
          d="M12 9.25a2.751 2.751 0 0 0 0 5.5 2.751 2.751 0 0 0 0-5.5zm0 1.5a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5zm.376-9.497a.749.749 0 0 0-.752 0 3.748 3.748 0 0 0 0 6.494.749.749 0 0 0 .752 0 3.748 3.748 0 0 0 0-6.494zM12 2.824c.46.412.75 1.01.75 1.676s-.29 1.264-.75 1.676c-.46-.412-.75-1.01-.75-1.676s.29-1.264.75-1.676zm-7.799.797a.747.747 0 0 0-.531.531 3.748 3.748 0 0 0 4.592 4.592.75.75 0 0 0 .531-.531 3.748 3.748 0 0 0-4.592-4.592zm.845 1.376a2.248 2.248 0 0 1 2.371 2.371 2.248 2.248 0 0 1-2.371-2.371zm-3.744 6.578a.749.749 0 0 0 0 .752 3.748 3.748 0 0 0 6.494 0 .749.749 0 0 0 0-.752 3.748 3.748 0 0 0-6.494 0zm1.571.376c.412-.46 1.01-.75 1.676-.75s1.264.29 1.676.75c-.412.46-1.01.75-1.676.75s-1.264-.29-1.676-.75zm.797 7.799a.748.748 0 0 0 .531.531 3.748 3.748 0 0 0 4.592-4.592.75.75 0 0 0-.531-.531A3.748 3.748 0 0 0 3.67 19.75zm1.376-.845a2.248 2.248 0 0 1 2.371-2.371 2.248 2.248 0 0 1-2.371 2.371zm7.33-2.75a.749.749 0 0 0-.752 0 3.748 3.748 0 0 0 0 6.494.749.749 0 0 0 .752 0 3.75 3.75 0 0 0 0-6.494zM12 17.726c.46.412.75 1.01.75 1.676s-.29 1.264-.75 1.676c-.46-.412-.75-1.01-.75-1.676s.29-1.264.75-1.676zm3.738-2.568a.75.75 0 0 0-.531.531 3.748 3.748 0 0 0 4.592 4.592.748.748 0 0 0 .531-.531 3.748 3.748 0 0 0-4.592-4.592zm.845 1.376a2.248 2.248 0 0 1 2.371 2.371 2.248 2.248 0 0 1-2.371-2.371zm-.379-4.959a.749.749 0 0 0 0 .752 3.748 3.748 0 0 0 6.494 0 .749.749 0 0 0 0-.752 3.748 3.748 0 0 0-6.494 0zm1.571.376c.412-.46 1.01-.75 1.676-.75s1.264.29 1.676.75c-.412.46-1.01.75-1.676.75s-1.264-.29-1.676-.75zm-2.568-3.738a.75.75 0 0 0 .531.531 3.748 3.748 0 0 0 4.592-4.592.747.747 0 0 0-.531-.531 3.748 3.748 0 0 0-4.592 4.592zm1.376-.845a2.248 2.248 0 0 1 2.371-2.371 2.248 2.248 0 0 1-2.371 2.371z"
          fill='url("#SvgjsLinearGradient1049")'
        ></path>
        <defs>
          <linearGradient id="SvgjsLinearGradient1049">
            <stop stopColor="#01BEAD" offset="0"></stop>
            <stop stopColor="#0b5351" offset="1"></stop>
          </linearGradient>
        </defs>
      </svg>

      <h1>About</h1>
      <p>
        Hello everyone, first of all, thank you for visiting the website. I
        created this website with the purpose of helping users express their
        thought and emotions in written format. Writing and reading are some of
        the most meaningful activities that a human being can engage with. To
        that end, this website was created.
      </p>
      <h3>About the developer</h3>
      <p>
        My name is Muhammed Raşid Sevim. I am based in Turkey and I have been
        learning web development since August 2023. This website is my first
        full stack application. I wanted to make something useful while also
        adding to my web development skills. For more information about me, you
        can check my{" "}
        <Link
          href={links.linkedIn}
          className="unstyled-link about-link"
          target="_blank"
        >
          LinkedIn
        </Link>{" "}
        page and my{" "}
        <Link
          href={links.portfolio}
          className="unstyled-link about-link"
          target="_blank"
        >
          portfolio
        </Link>
        .
      </p>
      <h3>Mission</h3>
      <p>
        My purpose of this website is to provide people an area where they can
        write and share their writings. Writing can be quite engaging and you
        can tap into your consciousness. I hope that this website allows that
        kind of engagement with your consciousness.
      </p>
      <h3>Values</h3>
      <p>
        Freedom of speech is one value of the website. I believe, as long as it
        is not personal insults, swears, threats or similar, people should be
        able to openly speak their thoughts and feelings. It is important that
        those expressions are not censored, irrespective of whether one agrees
        with them or not.
      </p>
      <p>
        Another value is encouragement to write. I believe people should
        encourage and support each other to write. Evet some simple phrases such
        as "good job" or "nice article" can go a long way in uplifting one's
        mindstate. Therefore any form of encouragement is, ehm, encouraged.
      </p>
    </div>
  );
};
export default page;
