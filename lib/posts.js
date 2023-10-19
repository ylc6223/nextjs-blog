/*
* 解析每个 Markdown 文件并获取title、date和 文件名（将用作id帖子 URL）。
在索引页上列出数据，按日期排序。
*
* */
// 渲染 Markdown 内容，我们将使用该remark库
import { remark } from 'remark'
import html from 'remark-html';
import fs from 'fs';
import path from 'path';
// matter是一个库，可让您解析每个 Markdown 文件中的元数据。
import matter from 'gray-matter';

// process.cwd() 方法返回 Node.js 进程的当前工作目录
const postsDirectory = path.join(process.cwd(), 'posts');

// 获取排序后的帖子数据
export function getSortedPostsData() {
    // 获取/posts下的文件名
    const fileNames = fs.readdirSync(postsDirectory);
    const allPostsData = fileNames.map((fileName) => {
        // 从文件名中删除“.md”以获取 id
        const id = fileName.replace(/\.md$/, '');

        // 将 Markdown 文件读取为字符串
        const fullPath = path.join(postsDirectory, fileName);
        const fileContents = fs.readFileSync(fullPath, 'utf8');

        // Use gray-matter 解析帖子元数据部分
        const matterResult = matter(fileContents);

        // Combine the data with the id
        return {
            id,
            ...matterResult.data,
        };
    });
    // Sort posts by date
    return allPostsData.sort((a, b) => {
        if (a.date < b.date) {
            return 1;
        } else {
            return -1;
        }
    });
}


// 它将返回 post 目录中的文件名列表(不包括. md) :
export function getAllPostIds() {
    const fileNames = fs.readdirSync(postsDirectory);

    // 返回一个如下所示的数组：
    // [
    //   {
    //     params: {
    //       id: 'ssg-ssr'
    //     }
    //   },
    //   {
    //     params: {
    //       id: 'pre-rendering'
    //     }
    //   }
    // ]

    // 返回的列表不仅仅是一个字符串数组 - 它必须是一个类似于上面注释的对象数组。
    return fileNames.map((fileName) => {
        return {
            params: {
                id: fileName.replace(/\.md$/, ''),
            },
        };
    });
}

// 获取帖子详情
export async function getPostData(id) {
    const fullPath = path.join(postsDirectory, `${id}.md`);
    const fileContents = fs.readFileSync(fullPath, 'utf8');

    // Use gray-matter 解析帖子元数据部分
    const matterResult = matter(fileContents);

    // 使用remark将markdown转换为HTML字符串
    const processedContent = await remark()
        .use(html)
        .process(matterResult.content);
    const contentHtml = processedContent.toString();

    // 将数据与 id 结合起来
    return {
        id,
        contentHtml,
        ...matterResult.data,
    };
}