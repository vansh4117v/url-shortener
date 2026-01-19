import { useEffect, useState } from "react";
import {
  Search,
  User,
  Calendar,
  Eye,
  Link as LinkIcon,
  MoreVertical,
  Trash2,
  Copy,
  Check,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/context/context";
import useFetch from "@/hooks/use-fetch";
import { deleteUrl, fetchUserUrls } from "@/api/url";
import { Link, useNavigate } from "react-router-dom";

function Dashboard() {
  const { user } = useAuth();
  const [links, setLinks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [copiedLink, setCopiedLink] = useState(null);
  const [filteredLinks, setFilteredLinks] = useState(links);
  const navigate = useNavigate();

  const { data, error, loading, fn: getUrls } = useFetch(fetchUserUrls);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleCopy = (shortId, linkId) => {
    navigator.clipboard.writeText(import.meta.env.VITE_BASE_URL + "/" + shortId);
    setCopiedLink(linkId);
    setTimeout(() => {
      if (copiedLink === linkId) {
        setCopiedLink(null);
      }
    }, 2000);
  };

  const handleDelete = async (link) => {
    try {
      await deleteUrl(link.shortId);
      setLinks(links.filter((l) => l._id !== link._id));
    } catch (error) {
      console.error("Error deleting link:", error);
    }
  };

  const onViewLink = (link) => {
    navigate(`/link/${link.shortId}`);
  };

  // Filter links based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredLinks(links);
      return;
    }

    const term = searchTerm.toLowerCase();
    const filtered = links.filter(
      (link) =>
        link.title.toLowerCase().includes(term) ||
        link.shortId.toLowerCase().includes(term) ||
        link.longUrl.toLowerCase().includes(term)
    );

    setFilteredLinks(filtered);
  }, [searchTerm, links]);

  useEffect(() => {
    getUrls();
  }, []);

  useEffect(() => {
    if (data && data.success) {
      setLinks(data.data);
    } else {
      setLinks([]);
    }
  }, [data, error, loading]);

  return (
    <div className="container mx-auto px-4 py-4 max-w-6xl">
      {/* User Profile Section */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden mb-8">
        <div className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 flex items-center">
            <User className="w-5 h-5 mr-2 text-blue-600" />
            Your Profile
          </h2>
        </div>

        <div className="p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex items-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold mr-4">
                {user.name.charAt(0)}
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800">{user.name}</h3>
                <p className="text-gray-600">{user.email}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-6 md:mt-0">
              <div className="text-center p-3 bg-gray-50 rounded-lg border border-gray-200">
                <div className="text-2xl font-bold text-blue-600">{links.length}</div>
                <div className="text-sm text-gray-500">Total Links</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg border border-gray-200">
                <div className="text-2xl font-bold text-purple-600">
                  {links.reduce((sum, link) => sum + link.clicks, 0).toLocaleString()}
                </div>
                <div className="text-sm text-gray-500">Total Clicks</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Links Management Section */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-100">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <h2 className="text-xl font-bold text-gray-800 flex items-center mb-4 md:mb-0">
              <LinkIcon className="w-5 h-5 mr-2 text-blue-600" />
              Your Short Links
            </h2>

            <div className="relative w-full md:w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search links..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
              />
            </div>
          </div>
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left py-4 px-6 font-semibold text-gray-600">Title</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-600">Short URL</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-600">Original URL</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-600">Clicks</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-600">Created</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredLinks.map((link) => (
                <tr key={link._id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-6">
                    <div className="font-medium text-gray-800">{link.title}</div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center">
                      <Link to={`/${link?.shortId}`} className="text-gray-500 cursor-pointer">
                        {import.meta.env.VITE_BASE_URL}/
                      </Link>
                      <Link
                        to={`/${link?.shortId}`}
                        className="text-blue-600 cursor-pointer font-medium"
                      >
                        {link?.shortId?.split("/").pop()}
                      </Link>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-gray-600 truncate max-w-xs" title={link.longUrl}>
                      {link.longUrl}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center text-blue-600 font-medium">
                      <Eye className="w-4 h-4 mr-1" />
                      {link.clicks.toLocaleString()}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center text-gray-600">
                      <Calendar className="w-4 h-4 mr-1" />
                      {formatDate(link.createdAt)}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => onViewLink(link)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="View details"
                      >
                        <LinkIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleCopy(link.shortId, link._id)}
                        className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                        title="Copy link"
                      >
                        {copiedLink === link._id ? (
                          <Check className="w-4 h-4" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                      <button
                        onClick={() => handleDelete(link)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete link"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredLinks.length === 0 && (
            <div className="p-12 text-center text-gray-500">
              {searchTerm ? (
                <div>
                  <p className="text-lg font-medium mb-2">No links found matching "{searchTerm}"</p>
                  <button
                    onClick={() => setSearchTerm("")}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Clear search
                  </button>
                </div>
              ) : (
                <div>
                  <p className="text-lg font-medium mb-2">
                    You haven't created any short links yet
                  </p>
                  <p className="text-gray-500">Create your first short link to see it here</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden divide-y divide-gray-100">
          {filteredLinks.map((link) => (
            <div key={link._id} className="p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-medium text-gray-800">{link.title}</h3>
                  <div className="flex items-center mt-1 text-sm text-gray-500">
                    <Calendar className="w-3 h-3 mr-1" />
                    {formatDate(link.createdAt)}
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="p-1 text-gray-400 hover:text-gray-600 focus:outline-none">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem onClick={() => onViewLink(link)}>
                      <LinkIcon className="mr-2 h-4 w-4" />
                      <span>View details</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleCopy(link.shortId, link._id)}>
                      {copiedLink === link._id ? (
                        <>
                          <Check className="mr-2 h-4 w-4 text-green-500" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="mr-2 h-4 w-4" />
                          <span>Copy link</span>
                        </>
                      )}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-red-600 focus:text-red-600"
                      onClick={() => handleDelete(link)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      <span>Delete link</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="space-y-2 mb-3">
                <div>
                  <div className="text-xs text-gray-500">Short URL</div>
                  <div className="flex items-center">
                    <Link to={`/${link?.shortId}`} className="text-gray-500 cursor-pointer">
                      {import.meta.env.VITE_BASE_URL}/
                    </Link>
                    <Link
                      to={`/${link?.shortId}`}
                      className="text-blue-600 cursor-pointer font-medium"
                    >
                      {link?.shortId?.split("/").pop()}
                    </Link>
                  </div>
                </div>

                <div>
                  <div className="text-xs text-gray-500">Original URL</div>
                  <div className="text-gray-600 text-sm truncate" title={link.longUrl}>
                    {link.longUrl}
                  </div>
                </div>

                <div className="flex items-center text-blue-600 text-sm">
                  <Eye className="w-3 h-3 mr-1" />
                  {link.clicks.toLocaleString()} clicks
                </div>
              </div>

              <div className="flex space-x-2 pt-2 border-t border-gray-100">
                <button
                  onClick={() => onViewLink(link)}
                  className="flex-1 py-2 px-3 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors"
                >
                  View Details
                </button>
                <button
                  onClick={() => handleCopy(link.shortId, link._id)}
                  className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                    copiedLink === link._id
                      ? "bg-green-50 text-green-600"
                      : "bg-purple-50 text-purple-600 hover:bg-purple-100"
                  }`}
                >
                  {copiedLink === link._id ? (
                    <>
                      <Check className="inline mr-1 h-3 w-3" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="inline mr-1 h-3 w-3" />
                      Copy
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}

          {filteredLinks.length === 0 && (
            <div className="p-8 text-center text-gray-500">
              {searchTerm ? (
                <div>
                  <p className="text-base font-medium mb-2">
                    No links found matching "{searchTerm}"
                  </p>
                  <button
                    onClick={() => setSearchTerm("")}
                    className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                  >
                    Clear search
                  </button>
                </div>
              ) : (
                <div>
                  <p className="text-base font-medium mb-2">
                    You haven't created any short links yet
                  </p>
                  <p className="text-gray-500 text-sm">
                    Create your first short link to see it here
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
