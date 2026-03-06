// import DatabaseCard from "../components/navbar/documentpage/DatabaseCard";
import HeroBanner from "../components/navbar/documentpage/HeroBanner";
import StepCard from "../components/navbar/documentpage/StepCard";
const Document = () => {
    return (
        <div className="bg-white min-h-screen pb-20">

            {/* HeroBanner */}
            <HeroBanner />

            {/* ជំហានទី ១ - ពណ៌បៃតង */}
            <StepCard
                stepNumber="១"
                title="ចូលគណនី"
                bgColor="#cbd9c3"
                borderColor="#4b7a3a"
                listColor="#4b7a3a"
                textColor="#2d4d23"
                steps={[
                    "អ្នកប្រើត្រូវមានគណនីដែលបានបញ្ជាក់រួចរាល់។",
                    "បញ្ចូលអ៊ីមែល និងពាក្យសម្ងាត់។",
                    "ចូលទៅកាន់ផ្ទាំងគ្រប់គ្រង (Dashboard)។"
                ]}
            />

            {/* ជំហានទី ២ - ពណ៌ស្វាយ */}
            <StepCard
                stepNumber="២"
                title="ស្វែងរកវគ្គសិក្សា"
                bgColor="#e1d5f5"
                borderColor="#8a5cf5"
                listColor="#8a5cf5"
                textColor="#4a308b"
                steps={[
                    "ចូលទៅកាន់ទំព័រ វគ្គសិក្សា។",
                    "មើលវគ្គសិក្សាដែលមាន។",
                    "តម្រៀបតាមប្រភេទ (ឧ. Programming, Web Development)។",
                    "ចុចលើវគ្គសិក្សា ដើម្បីមើលព័ត៌មានលម្អិត។"
                ]}
            />
            {/* ជំហានទី ៣ */}
            <StepCard
                stepNumber="៣"
                title="មើលព័ត៌មានវគ្គសិក្សា"
                bgColor="#cceeff"
                borderColor="#0099ff"
                listColor="#0099ff"
                textColor="#005580"
                description="នៅលើទំព័រវគ្គសិក្សា សិស្សអាចមើលឃើញ៖"
                steps={[
                    "ចំណងជើងវគ្គសិក្សា",
                    "សេចក្តីពិពណ៌នា",
                    "កម្រិត (ចាប់ផ្តើម / មធ្យម / ខ្ពស់)",
                    "ចំនួនមេរៀន",
                    "ឈ្មោះគ្រូបង្រៀន",
                    "រយៈពេលសិក្សា"
                ]}
            />
            {/* ជំហានទី ៤ - ពណ៌ផ្កាឈូក (Pink) */}
            <StepCard
                stepNumber="៤"
                title="ចូលប្រើវគ្គសិក្សា"
                bgColor="#f7d0e0"       /* ពណ៌ផ្កាឈូកខ្ចី */
                borderColor="#e91e63"   /* ពណ៌ផ្កាឈូកចាស់ */
                listColor="#e91e63"    /* ពណ៌លេខរៀង */
                textColor="#880e4f"     /* ពណ៌អត្ថបទ */
                steps={[
                    "វគ្គសិក្សានឹងបង្ហាញនៅក្នុង ទំព័រចូលរៀន",
                    "សិស្សអាចចាប់ផ្តើមមេរៀនដំបូងបាន។"
                ]}
            />
            {/* ជំហានទី ៥ - ពណ៌ក្រហម (Red/Coral) */}
            <StepCard
                stepNumber="៥"
                title="ប្រព័ន្ធរក្សាទុកការចុះឈ្មោះ (System Saves Enrollment)"
                bgColor="#f8c8c8"       /* ពណ៌ក្រហមខ្ចី */
                borderColor="#f44336"   /* ពណ៌ក្រហមចាស់ */
                listColor="#f44336"    /* ពណ៌លេខរៀង */
                textColor="#b71c1c"     /* ពណ៌អត្ថបទ */
                description="ប្រសិនបើគ្រប់យ៉ាងត្រឹមត្រូវ៖"
                steps={[
                    "វគ្គសិក្សាត្រូវបានបន្ថែមទៅក្នុងប្រវត្តិអ្នកប្រើ។",
                    "កំណត់ត្រាការចុះឈ្មោះត្រូវបានរក្សាទុកក្នុងកន្លែងផ្ទុកទិន្នន័យ (Database)។"
                ]}
            />

            {/* បន្ថែម Database Card នៅទីនេះ */}
            {/* <DatabaseCard/> */}

        </div>
    );
};

export default Document;