import PageLayout from "../components/PageLayout"
import { Home, ChevronRight, Bookmark } from "lucide-react"
import Link from "next/link"

export default function BookmarksPage() {
  return (
    <PageLayout>
      <div className="flex-1 p-6">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-400 mb-6">
          <div className="flex items-center space-x-1">
            <Home className="w-4 h-4 text-teal-400" />
            <Link href="/" className="text-teal-400 hover:text-teal-300">
              Home
            </Link>
          </div>
          <ChevronRight className="w-4 h-4" />
          <span>Bookmarks</span>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-white mb-2">Bookmarks</h1>
          <p className="text-gray-400">Your saved duas</p>
        </div>

        {/* Content */}
        <div className="text-center py-12">
          <Bookmark className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 text-lg mb-2">No bookmarks yet</p>
          <p className="text-gray-500">Start bookmarking your favorite duas to see them here.</p>
        </div>
      </div>
    </PageLayout>
  )
}
