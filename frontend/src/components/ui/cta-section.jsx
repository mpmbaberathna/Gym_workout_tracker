/* reusable call-to-action section component @param {object} props - component props @param {string} [props.badge='become a frontend developer'] - badge text to display @param {string} [props.title='want to learn how to build templates like this one?'] - main heading text @param {string} [props.buttontext='visit www.pixelrocket.store'] - button text @param {string} [props.buttonurl='https://www.pixelrocket.store'] - button url @param {boolean} [props.showarrow=true] - whether to show arrow icon in button @param {string} [props.classname=''] - additional css classes @param {string} [props.backgroundimagepath='/images'] - path to background images */
const CTASection = ({
  badge = 'Become A Frontend Developer',
  title = 'Want to learn how to build templates like this one?',
  buttonText = 'Visit www.pixelrocket.store',
  buttonUrl = 'https://www.pixelrocket.store',
  showArrow = true,
  className = '',
  backgroundImagePath = '/images'
}) => {
  return (
    <section className={`py-12 md:py-24 ${className}`}>
      <div className="container px-4 mx-auto">
        <div className="relative pb-16 border-b border-yellowGreen-400 overflow-hidden">
          {/* background images */}
          <img
            className="absolute bottom-0 left-1/2 md:-mb-2 lg:-mb-20 transform -translate-x-1/2"
            src={`${backgroundImagePath}/cta-line-green-bottom.png`}
            alt=""
            aria-hidden="true"
          />
          <img
            className="absolute bottom-0 left-1/2 -mb-5 sm:-mb-10 md:-mb-16 lg:-mb-28 transform -translate-x-1/2"
            src={`${backgroundImagePath}/cta-light-green-bottom.png`}
            alt=""
            aria-hidden="true"
          />

          {/* content */}
          <div className="relative max-w-sm md:max-w-xl mx-auto text-center">
            {badge && (
              <span className="inline-flex items-center h-6 mb-4 px-2 text-sm font-medium text-yellowGreen-700 bg-yellowGreen-200 rounded-full">
                {badge}
              </span>
            )}

            <h2 className="font-heading tracking-tight text-4xl sm:text-5xl font-bold mb-10">
              {title}
            </h2>

            <a
              className="group relative flex xs:inline-flex items-center justify-center px-5 h-12 font-bold text-sm text-white bg-gradient-to-br from-cyanGreen-800 to-cyan-800 rounded-lg transition-all duration-300 hover:from-cyanGreen-900 hover:to-cyan-900 focus:outline-none focus:ring-4 focus:ring-cyanGreen-500"
              href={buttonUrl}
              aria-label={`${buttonText} - Opens in new tab`}
              target="_blank"
              rel="noopener noreferrer"
            >

              <span className={showArrow ? 'mr-2' : ''}>
                {buttonText}
              </span>

              {showArrow && (
                <span className="transform group-hover:translate-x-1 transition duration-200" aria-hidden="true">
                  <svg width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M4.5 8H12.8333M12.8333 8L8.83334 4M12.8333 8L8.83334 12"
                      stroke="white"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              )}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;