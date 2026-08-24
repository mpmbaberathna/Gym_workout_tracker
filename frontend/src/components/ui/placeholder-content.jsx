/* placeholdercontent component displays a message prompting users to download the full template used on non-homepage routes in the starter template */
const PlaceholderContent = () => {
  return (
    <div className="container mx-auto px-4 my-20">
      <p className="py-4 text-center bg-yellowGreen-600 text-gray-900 rounded-lg">
        Thank you for your interest in this template! You've downloaded the starter template which only includes the homepage. You can download the full version of this template for free by creating an account on my website and joining my newsletter.{" "}
        <a
          className="underline"
          href="https://www.pixelrocket.store/free-templates/react-templates/frequencii-tailwind-react-website-template"
        >
          Click here to visit view this template on my website.
        </a>
      </p>
    </div>
  );
};

export default PlaceholderContent;
