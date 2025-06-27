import {ProfileParserForm} from "@/components/forms/ProfileParserForm";
import {Layout} from "antd";

/**
 * Home page component
 */
export default function Home() {
    return (
        <Layout style={{minHeight: "100vh"}}>
            <ProfileParserForm/>
        </Layout>
    );
}
