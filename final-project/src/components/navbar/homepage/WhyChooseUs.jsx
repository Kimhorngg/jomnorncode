export default function WhyChooseUs() {
  return (
    <section className="bg-[#112d50] py-16 px-4 sm:px-6 md:px-10 lg:px-16 text-white mt-30 mb-20 dark:bg-[#0e172b]">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
            ហេតុអ្វីគួរជ្រើសរើសយើង
          </h2>
          <div className="w-24 h-1 bg-[#ffa500] mx-auto rounded-full"></div>
        </div>

        {/* Three Columns / Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-14 px-4 sm:px-6 md:px-12 lg:px-16 xl:px-20 max-w-full md:max-w-9xl mx-auto">
  {/* Cards */}

          {/* Card 1 */}
          <div className="flex flex-col items-center text-center">
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-white flex items-center justify-center mb-6 border-2 border-white/20">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 640 640"
                className="text-blue-600 text-4xl md:text-5xl"
              >
                <path
                  fill="#3f71ae"
                  d="M480 576L192 576C139 576 96 533 96 480L96 160C96 107 139 64 192 64L496 64C522.5 64 544 85.5 544 112L544 400C544 420.9 530.6 438.7 512 445.3L512 512C529.7 512 544 526.3 544 544C544 561.7 529.7 576 512 576L480 576zM192 448C174.3 448 160 462.3 160 480C160 497.7 174.3 512 192 512L448 512L448 448L192 448zM224 216C224 229.3 234.7 240 248 240L424 240C437.3 240 448 229.3 448 216C448 202.7 437.3 192 424 192L248 192C234.7 192 224 202.7 224 216zM248 288C234.7 288 224 298.7 224 312C224 325.3 234.7 336 248 336L424 336C437.3 336 448 325.3 448 312C448 298.7 437.3 288 424 288L248 288z"
                />
              </svg>
            </div>
            <h3 className="text-2xl md:text-3xl font-semibold mb-4">
              មេរៀនគុណភាព
            </h3>
            <p className="text-gray-300 leading-relaxed text-lg">
              មេរៀនលម្អិតពីមូលដ្ឋានរហូតដល់កម្រិតខ្ពស់ ដែលបង្កើតឡើងដោយអ្នកជំនាញ
            </p>
          </div>

          {/* Card 2 */}
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-white flex items-center justify-center mb-6 border-2 border-white/20">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 640 640"
                className="text-blue-600"
              >
                <path
                  fill="#3f71ae"
                  d="M535.3 70.7C541.7 64.6 551 62.4 559.6 65.2C569.4 68.5 576 77.7 576 88L576 274.9C576 406.1 467.9 512 337.2 512C260.2 512 193.8 462.5 169.7 393.3C134.3 424.1 112 469.4 112 520C112 533.3 101.3 544 88 544C74.7 544 64 533.3 64 520C64 445.1 102.2 379.1 160.1 340.3C195.4 316.7 237.5 304 280 304L360 304C373.3 304 384 293.3 384 280C384 266.7 373.3 256 360 256L280 256C240.3 256 202.7 264.8 169 280.5C192.3 210.5 258.2 160 336 160C402.4 160 451.8 137.9 484.7 116C503.9 103.2 520.2 87.9 535.4 70.7z"
                />
              </svg>
            </div>
            <h3 className="text-2xl md:text-3xl font-semibold mb-4">
              មេរៀនគុណភាព
            </h3>
            <p className="text-gray-300 leading-relaxed text-lg">
              មេរៀនលម្អិតពីមូលដ្ឋានរហូតដល់កម្រិតខ្ពស់ ដែលបង្កើតឡើងដោយអ្នកជំនាញ
            </p>
          </div>

          {/* Card 3 */}
          <div className="flex flex-col items-center text-center">
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-white flex items-center justify-center mb-6 border-2 border-white/20">
              <svg
                className="w-14 h-14 md:w-16 md:h-16 text-[#3f71af]"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
              </svg>
            </div>
            <h3 className="text-2xl md:text-3xl font-semibold mb-4">
              រៀនបានគ្រប់ទីកន្លែង
            </h3>
            <p className="text-gray-300 leading-relaxed text-lg">
              អាចចូលរៀនតាមទូរស័ព្ទ កុំព្យូទ័រ ឬ Tablet ដោយត្រូវការតែអ៊ីនធឺណិតប៉ុណ្ណោះ
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}