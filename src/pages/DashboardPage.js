import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function DashboardPage() {
  const navigate = useNavigate();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [prompt, setPrompt] = useState('');
  const [tone, setTone] = useState('');
  const [category, setCategory] = useState('');
  const [language, setLanguage] = useState('');
  const [loading, setLoading] = useState(false);
  const [blogsLoading, setBlogsLoading] = useState(false);
  const [generatedBlog, setGeneratedBlog] = useState('');
  const [blogs, setBlogs] = useState([]);
  const [showBlogs, setShowBlogs] = useState(false);
  const [credits, setCredits] = useState(localStorage.getItem('credits') || 0);
  const [redeemCode, setRedeemCode] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      navigate('/login');
    } else {
      fetchBlogsAndCredits();
      setIsCheckingAuth(false);
    }
  }, [navigate]);

  const fetchBlogsAndCredits = async () => {
    setBlogsLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('authToken');
      const res = await axios.get('https://ai-blog-generator-backend-txka.onrender.com/blogs', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBlogs(res.data.blogs);
      setCredits(res.data.credits);
      localStorage.setItem('credits', res.data.credits);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load blogs.');
      toast.error(err.response?.data?.message || 'Failed to load blogs.');
    }
    setBlogsLoading(false);
  };

  const handleGenerate = async () => {
    if (!prompt || !tone || !category || !language) {
      toast.error('Please fill in all fields.');
      return;
    }
    if (prompt.toLowerCase().includes('helth')) {
      toast.warn('Did you mean "health"? Please check your prompt.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('authToken');
      const res = await axios.post(
        'https://ai-blog-generator-backend-txka.onrender.com/generate',
        { prompt, tone, category, language },
        { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } }
      );

      setGeneratedBlog(res.data.generatedText);
      setCredits(res.data.credits);
      localStorage.setItem('credits', res.data.credits);
      toast.success('Blog generated successfully!');
      fetchBlogsAndCredits();
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to generate blog.';
      setError(errorMessage);
      toast.error(errorMessage);
    }
    setLoading(false);
  };

  const handleRedeem = async () => {
    if (!redeemCode) {
      toast.error('Please enter a redemption code.');
      return;
    }

    setError('');
    try {
      const token = localStorage.getItem('authToken');
      const res = await axios.post(
        'https://ai-blog-generator-backend-txka.onrender.com/redeem',
        { code: redeemCode },
        { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } }
      );

      setCredits(res.data.credits);
      localStorage.setItem('credits', res.data.credits);
      toast.success(res.data.message);
      setRedeemCode('');
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to redeem code.';
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  const handleDeleteBlog = async (blogId) => {
    if (!window.confirm('Are you sure you want to delete this blog?')) return;

    setError('');
    try {
      const token = localStorage.getItem('authToken');
      await axios.delete(`https://ai-blog-generator-backend-txka.onrender.com/blogs/${blogId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Blog deleted successfully!');
      fetchBlogsAndCredits();
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to delete blog.';
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  if (isCheckingAuth) return null;

  return (
    <div className="text-white py-4 px-6 bg-[#02020c] flex flex-col" style={{ backgroundImage: "url('/assets/DashboardBackground.png')" }}>
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="flex items-center justify-between text-white my-2 bg-[#5859b1] bg-opacity-10 backdrop-blur-md border border-[blue] rounded-2xl shadow md:px-6 px-2 py-3 font-[Poppins]">
        <div className="flex items-end">
          <img src="assets/Copilot_20250726_105948.png" alt="Logo" className="md:w-14 w-10 md:h-14 h-10 md:mr-4 mr-2" />
          <h1 className="md:text-xl text-sm w-2">Blog Generator</h1>
        </div>
        <div className="flex items-center md:space-x-4 space-x-2 md:text-base text-xs">
          <p className="cursor-pointer" onClick={() => setShowBlogs(false)}>New Blog</p>
          <p className="cursor-pointer" onClick={() => setShowBlogs(true)}>My Blogs</p>
          <p>Credits: {credits}</p>
          <button
            onClick={() => {
              localStorage.removeItem('authToken');
              localStorage.removeItem('credits');
              navigate('/login');
            }}
            className="bg-blue-950 bg-opacity-10 hover:bg-blue-700 text-white md:py-2 py-1 md:px-4 px-2 rounded border border-blue-950"
          >
            Logout
          </button>
        </div>
      </div>

      {error && <p className="text-red-400 text-sm mb-4 text-center">{error}</p>}

      {showBlogs ? (
        <div className="md:my-6 my-2 w-full bg-[#5859b1] bg-opacity-10 backdrop-blur-md border border-[blue] rounded-lg shadow p-6 text-white flex flex-col font-[Poppins]">
          <h1 className="md:text-xl text-base mb-4">My Blogs</h1>
          {blogsLoading ? (
            <p className="text-center">Loading blogs...</p>
          ) : blogs.length === 0 ? (
            <p>No blogs found.</p>
          ) : (
            <div className="space-y-4">
              {blogs.map(blog => (
                <div key={blog._id} className="p-4 bg-[#1a1a42] bg-opacity-10 backdrop-blur-md border border-[blue] rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <h2 className="text-lg font-semibold">{blog.prompt}</h2>
                    <button
                      onClick={() => handleDeleteBlog(blog._id)}
                      className="text-sm text-red-400 border border-red-400 px-2 py-1 rounded hover:bg-red-400 hover:text-white"
                    >
                      Delete
                    </button>
                  </div>
                  <p className="text-sm text-gray-300">
                    Category: {blog.category} | Tone: {blog.tone} | Language: {blog.language}
                  </p>
                  <p className="text-sm mt-2 whitespace-pre-wrap">{blog.generatedText}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="flex md:flex-row flex-col justify-between md:gap-6">
          
          <div className="md:my-6 my-2 md:w-[70%] bg-[#5859b1] bg-opacity-10 backdrop-blur-md border border-[blue] rounded-lg shadow p-6 text-white flex flex-col font-[Poppins]">
            <div className="mb-4">
              <label className="block text-white mb-1 font-medium">Blog Prompt</label>
              <textarea
                className="w-full h-32 px-4 py-2 border border-blue-500 rounded bg-black text-white placeholder-gray-400 resize-none"
                placeholder="Enter your blog prompt here (e.g., 'health blog')..."
                value={prompt}
                onChange={e => setPrompt(e.target.value)}
              />
            </div>

            <div className="flex justify-between mt-2">
              <h1 className="text-sm">Tone</h1>
              <select
                value={tone}
                onChange={e => setTone(e.target.value)}
                className="text-sm border border-blue-500 rounded px-3 py-2 bg-black text-white"
              >
                <option value="">Select Tone</option>
                <option value="Friendly">Friendly</option>
                <option value="Professional">Professional</option>
                <option value="casual">Casual</option>
                <option value="formal">Formal</option>
                <option value="neutral">Neutral</option>
              </select>
            </div>

            <div className="flex justify-between mt-4">
              <h1 className="text-sm">Category</h1>
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="text-sm border border-blue-500 rounded px-3 py-2 bg-black text-white"
              >
                <option value="">Select Category</option>
                <option value="tech">Tech</option>
                <option value="Health">Health</option>
                <option value="Finance">Finance</option>
                <option value="lifestyle">Lifestyle</option>
                <option value="education">Education</option>
                <option value="general">General</option>
              </select>
            </div>

            <div className="flex justify-between mt-4">
              <h1 className="text-sm">Language</h1>
              <select
                value={language}
                onChange={e => setLanguage(e.target.value)}
                className="text-sm border border-blue-500 rounded px-3 py-2 bg-black text-white"
              >
                <option value="">Select Language</option>
                <option value="English">English</option>
                <option value="Hindi">Hindi</option>
                <option value="Bengali">Bengali</option>
                <option value="Spanish">Spanish</option>
                <option value="French">French</option>
              </select>
            </div>


            <button
              onClick={handleGenerate}
              disabled={loading || credits < 1}
              className={`mt-6 bg-blue-950 bg-opacity-10 text-white py-2 px-4 rounded border border-blue-950 ${
                credits < 1 || loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
              }`}
            >
              {loading ? 'Generating...' : credits < 1 ? 'Need Credits' : 'Generate Blog'}
            </button>
            
            <div className="mt-10">
              <h1 className="text-sm mb-2">Redeem Code - To Get More Credits</h1>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={redeemCode}
                  onChange={e => setRedeemCode(e.target.value)}
                  placeholder="Enter redemption code"
                  className="w-full px-4 py-2 border border-blue-500 rounded bg-black text-white placeholder-gray-400"
                />
                <button
                  onClick={handleRedeem}
                  className="bg-blue-950 bg-opacity-10 hover:bg-blue-700 text-white py-2 px-4 rounded border border-blue-950"
                >
                  Redeem
                </button>
              </div>
            </div>


          </div>
          

          

          <div className="md:my-6 my-2 w-full bg-[#5859b1] bg-opacity-10 backdrop-blur-md border border-[blue] rounded-lg shadow p-6 text-white flex flex-col font-[Poppins]">
            <div className="flex justify-between items-center mb-4">
              <h1 className="md:text-xl text-base">Preview</h1>
              <div className="flex items-center gap-3">
                <p
                  className="md:px-4 px-2 md:py-2 py-1 text-sm rounded-sm text-blue-500 border border-blue-950 hover:border-blue-800 cursor-pointer"
                  onClick={() => {
                    navigator.clipboard.writeText(generatedBlog);
                    toast.success('Blog copied to clipboard!');
                  }}
                >
                  Copy
                </p>
                <p
                  className="md:px-4 px-2 md:py-2 py-1 text-sm rounded-sm text-blue-500 border border-blue-950 hover:border-blue-800 cursor-pointer"
                  onClick={() => setGeneratedBlog('')}
                >
                  Clear
                </p>
              </div>
            </div>
            <div className="my-2 w-full h-full bg-[#1a1a42] bg-opacity-10 backdrop-blur-md border border-[blue] rounded-lg shadow p-6 text-white flex flex-col font-[Poppins]">
              {loading ? <h1 className="text-center">Loading preview...</h1> : <p className="text-sm">{generatedBlog || 'No blog generated yet.'}</p>}
            </div>
          </div>

        </div>
      )}
    </div>
  );
}