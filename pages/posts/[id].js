import Layout from '../../components/layout';
import Date from '../../components/date/date';
import Head from 'next/head';
import { getAllPostIds, getPostData } from '../../lib/posts';
import utilStyles from '../../styles/utils.module.css';
export default function Post({postData}) {
    return (
        <Layout>
            <Head>
                <title>{postData.title}</title>
            </Head>
            <article>
                <h1 className={utilStyles.headingXl}>{postData.title}</h1>
                <div>            {postData.id}</div>
                <div className={utilStyles.lightText}>
                    <Date dateString={postData.date} />
                </div>
                <div dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />
            </article>
        </Layout>
    );
}
export async function getStaticPaths() {
    // 返回 id 的可能值的列表
    const paths = getAllPostIds();
    return {
        paths,
        fallback: false,//回退
    };
}

export async function getStaticProps({ params }) {
    // 使用 params.id 获取博客文章的必要数据

    const postData = await getPostData(params.id);
    return {
        props: {
            postData,
        },
    };
}

