import {ProfileParserForm} from "@/components/ProfileParserForm";
import {Layout} from "antd";

export default function Home() {
  return (
    <Layout style={{ minHeight: "100vh" }}>

        <ProfileParserForm />

    </Layout>
  );
}
