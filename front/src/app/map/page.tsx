import React from "react";

const Contact = () => {
  return (
    <div>
      <section className="text-gray-600 body-font relative">
        <div className="absolute inset-0 bg-gray-300">
          <iframe
            src="https://www.google.com/maps/d/u/0/embed?mid=1kew-d7XLDgB5lY5pFufQQpq5unMj4r0&ehbc=2E312F&noprof=1"
            width="100%"
            height="100%"
            frameBorder="0"
            marginHeight={0}
            marginWidth={0}
            title="map"
            scrolling="no"
            style={{ filter: 'grayscale(1) contrast(1.2) opacity(0.4)' }}
          ></iframe>
        </div>
        <div className="container px-5 py-24 mx-auto flex">
          <div className="lg:w-1/3 md:w-1/2 bg-white rounded-lg p-8 flex flex-col md:ml-auto w-full mt-10 md:mt-0 relative z-10 shadow-md">
            <h2 className="text-gray-900 text-lg mb-1 font-medium title-font">Customer Feedback</h2>
            <p className="leading-relaxed mb-5 text-gray-600">We value your feedback & concerns. Please let us know how your shopping experience was or how we can improve our services.</p>
            <div className="relative mb-4">
              <label htmlFor="email" className="leading-7 text-sm text-gray-600">Your Email</label>
              <input type="email" id="email" name="email" className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
            </div>
            <div className="relative mb-4">
              <label htmlFor="message" className="leading-7 text-sm text-gray-600">Your Message</label>
              <textarea id="message" name="message" className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 h-32 text-base outline-none text-gray-700 py-1 px-3 resize-none leading-6 transition-colors duration-200 ease-in-out"></textarea>
            </div>
            <button className="text-white bg-orange-500 border-0 py-2 px-6 focus:outline-none hover:bg-orange-800 rounded text-lg">Submit Feedback</button>
            <p className="text-xs text-gray-500 mt-3">Thank you for helping us improve your future experiences!</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;