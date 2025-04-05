import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import MetaTag from '../../Components/Meta/MetaTag';

function BlogSinglePage() {
    const { slug } = useParams();
    const [blog, setBlog] = useState({});
    const [allBlog, setAllBlog] = useState([]);

    const fetchBlog = async () => {
        try {
            const res = await axios.get(`http://localhost:7987/api/v1/get_blog_by_slug/${slug}`);
            setBlog(res.data.data);
        } catch (error) {
            console.error("Internal server error in fetching blog", error);
            setError('Blog not found or an error occurred.');
        }
    };

    const fetchAllBlog = async () => {
        try {
            const res = await axios.get(`http://localhost:7987/api/v1/get-all-blogs`);
            const result = res.data.data;
            const filterData = result.filter((item) => item.isTranding === true);
            setAllBlog(filterData);
        } catch (error) {
            console.log("Internal server error in getting all blogs");
        }
    };

    // Utility function to calculate time ago
    const timeAgo = (date) => {
        const seconds = Math.floor((new Date() - new Date(date)) / 1000);
        let interval = Math.floor(seconds / 31536000);

        if (interval > 1) return interval + " years ago";
        interval = Math.floor(seconds / 2592000);
        if (interval > 1) return interval + " months ago";
        interval = Math.floor(seconds / 86400);
        if (interval > 1) return interval + " days ago";
        interval = Math.floor(seconds / 3600);
        if (interval > 1) return interval + " hours ago";
        interval = Math.floor(seconds / 60);
        if (interval > 1) return interval + " minutes ago";
        return seconds + " seconds ago";
    };

    useEffect(() => {
        fetchAllBlog();
        fetchBlog();
    }, [slug]);

    return (
        <>
        <MetaTag title={blog.metaTitle} description={blog.metaDescription} />
            <section className="page-title gray">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12 col-md-12">
                            <div className="breadcrumbs-wrap">
                                <h2 className="mb-0 ft-medium">{blog.title}</h2>
                                <nav className="transparent">
                                    <ol className="breadcrumb p-0">
                                        <li className="breadcrumb-item"><a href="#">Home</a></li>
                                        <li className="breadcrumb-item active theme-cl" aria-current="page">Blog Detail</li>
                                    </ol>
                                </nav>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section>
                <div className="container">
                    <div className="row">
                        <div className="col-lg-8 col-md-12 col-sm-12 col-12">
                            <div className="article_detail_wrapss single_article_wrap format-standard">
                                <div className="article_body_wrap">
                                    <div className="article_featured_image">
                                        <img className="blog-image" src={blog.largeImage?.url} alt={blog.title} />
                                    </div>
                                    <div dangerouslySetInnerHTML={{ __html: blog.content || 'No description available.' }}></div>
                                    <span className="post-date">
                                        <i className="ti-calendar"></i>
                                        {blog.createdAt ? timeAgo(blog.createdAt) : "Date not available"}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-4 col-md-12 col-sm-12 col-12">
                            <div className="single_widgets widget_thumb_post">
                                <h4 className="title">Trending Posts</h4>
                                <ul>
                                    {allBlog && allBlog.slice(0, 8).map((item, index) => (
                                        <li key={index}>
                                            <Link to={`/blog/${item.slug}`} className="left">
                                                <img src={item.smallImage?.url} alt={item.title} className="" />
                                            </Link>
                                            <span className="right">
                                                <Link className="feed-title" to={`/blog/${item.slug}`}>{item.title}</Link>
                                                <span className="post-date">
                                                    <i className="ti-calendar"></i>
                                                    {item.createdAt ? timeAgo(item.createdAt) : "Date not available"}
                                                </span>
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

export default BlogSinglePage;
