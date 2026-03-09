"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { GlassCard } from "@/components/glass-card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Heart, MessageCircle, PenLine, BookOpen, Clock,
  ChevronLeft, ChevronRight, Send, Loader2, Trash2,
  ImagePlus, Tag, Newspaper,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import api from "@/lib/api"
import { useAuthStore } from "@/store/authStore"

interface Author { id: number; name: string; branch: string | null; passout_year: number | null }
interface Post {
  id: number; type: "post" | "blog"; title: string | null; content: string
  cover_image_url: string | null; reading_time: number; tags: string[]
  like_count: number; comment_count: number; liked_by_me: boolean
  is_published: boolean; author: Author; created_at: string
}

function timeAgo(iso: string) {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000)
  if (diff < 60) return `${diff}s ago`
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return `${Math.floor(diff / 86400)}d ago`
}

function initials(name: string) {
  return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)
}

// ── Create Post Panel ────────────────────────────────────────────────────────
function CreatePostPanel({ user, onCreated }: { user: any; onCreated: (p: Post) => void }) {
  const [tab, setTab] = useState<"post" | "blog">("post")
  const [open, setOpen] = useState(false)
  const [content, setContent] = useState("")
  const [title, setTitle] = useState("")
  const [tags, setTags] = useState("")
  const [coverUrl, setCoverUrl] = useState("")
  const [submitting, setSubmitting] = useState(false)

  const submit = async (publish: boolean) => {
    if (!content.trim()) { toast.error("Content is required"); return }
    if (tab === "blog" && !title.trim()) { toast.error("Blog title is required"); return }
    setSubmitting(true)
    try {
      const res = await api.post("/feed/posts", {
        type: tab,
        content: content.trim(),
        title: tab === "blog" ? title.trim() : undefined,
        cover_image_url: tab === "blog" && coverUrl.trim() ? coverUrl.trim() : undefined,
        tags: tags.split(",").map(t => t.trim()).filter(Boolean),
        is_published: publish,
      })
      onCreated(res.data)
      setContent(""); setTitle(""); setTags(""); setCoverUrl(""); setOpen(false)
      toast.success(publish ? "Published!" : "Saved as draft")
    } catch {
      toast.error("Failed to publish")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <GlassCard>
      {/* Collapsed trigger */}
      {!open ? (
        <button
          onClick={() => setOpen(true)}
          className="w-full flex items-center gap-3 text-left"
        >
          <Avatar className="h-10 w-10 border border-border flex-shrink-0">
            <AvatarFallback className="bg-primary/20 text-primary font-semibold text-sm">
              {initials(user?.name ?? "U")}
            </AvatarFallback>
          </Avatar>
          <span className="flex-1 px-4 py-2.5 rounded-xl bg-secondary/60 border border-border text-muted-foreground text-sm hover:border-primary/40 hover:bg-secondary/80 transition-all">
            Share something with your college...
          </span>
          <div className="flex items-center gap-2 ml-2">
            <Badge variant="outline" className="bg-primary/10 border-primary/30 text-primary hidden sm:flex">
              <PenLine className="h-3 w-3 mr-1" /> Post
            </Badge>
            <Badge variant="outline" className="bg-purple-500/10 border-purple-500/30 text-purple-400 hidden sm:flex">
              <BookOpen className="h-3 w-3 mr-1" /> Blog
            </Badge>
          </div>
        </button>
      ) : (
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 border border-border flex-shrink-0">
              <AvatarFallback className="bg-primary/20 text-primary font-semibold text-sm">
                {initials(user?.name ?? "U")}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">{user?.name}</p>
              <p className="text-xs text-muted-foreground">{user?.branch ?? "Student"}</p>
            </div>
          </div>

          {/* Type toggle */}
          <Tabs value={tab} onValueChange={v => setTab(v as "post" | "blog")}>
            <TabsList className="bg-secondary/50 w-full sm:w-auto">
              <TabsTrigger value="post" className="flex-1 sm:flex-none data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <PenLine className="h-3.5 w-3.5 mr-1.5" /> Post
              </TabsTrigger>
              <TabsTrigger value="blog" className="flex-1 sm:flex-none data-[state=active]:bg-purple-500 data-[state=active]:text-white">
                <BookOpen className="h-3.5 w-3.5 mr-1.5" /> Blog
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Blog-specific fields */}
          {tab === "blog" && (
            <>
              <Input
                placeholder="Blog title..."
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="bg-secondary/50 border-border text-foreground placeholder:text-muted-foreground font-semibold text-base"
              />
              <div className="relative">
                <ImagePlus className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Cover image URL (optional)"
                  value={coverUrl}
                  onChange={e => setCoverUrl(e.target.value)}
                  className="pl-10 bg-secondary/50 border-border text-foreground placeholder:text-muted-foreground"
                />
              </div>
            </>
          )}

          {/* Content */}
          <Textarea
            placeholder={tab === "post" ? "What's on your mind?" : "Write your blog content here..."}
            value={content}
            onChange={e => setContent(e.target.value)}
            rows={tab === "blog" ? 8 : 4}
            className="bg-secondary/50 border-border text-foreground placeholder:text-muted-foreground resize-none"
          />

          {/* Tags */}
          <div className="relative">
            <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tags: placement, event, doubt (comma separated)"
              value={tags}
              onChange={e => setTags(e.target.value)}
              className="pl-10 bg-secondary/50 border-border text-foreground placeholder:text-muted-foreground"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setOpen(false)}
              className="text-muted-foreground hover:text-foreground"
            >
              Cancel
            </Button>
            <div className="flex gap-2">
              {tab === "blog" && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => submit(false)}
                  disabled={submitting}
                  className="border-border text-foreground hover:bg-secondary/80"
                >
                  Save Draft
                </Button>
              )}
              <Button
                size="sm"
                onClick={() => submit(true)}
                disabled={submitting}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                {submitting
                  ? <Loader2 className="h-4 w-4 animate-spin" />
                  : <><Send className="h-4 w-4 mr-1.5" />Publish</>
                }
              </Button>
            </div>
          </div>
        </div>
      )}
    </GlassCard>
  )
}

// ── Post Card ────────────────────────────────────────────────────────────────
function PostCard({ post, onLike, onDelete, currentUserId }: {
  post: Post; onLike: (id: number) => void
  onDelete: (id: number) => void; currentUserId: number
}) {
  const router = useRouter()
  const isBlog = post.type === "blog"

  return (
    <GlassCard
      hover
      className="cursor-pointer group relative overflow-hidden"
      onClick={() => router.push(`/feed/post/${post.id}`)}
    >
      {/* Accent line */}
      <div className={cn(
        "absolute top-0 left-0 right-0 h-0.5",
        isBlog ? "bg-gradient-to-r from-purple-500 to-pink-500" : "bg-gradient-to-r from-primary to-teal-400"
      )} />

      {/* Blog cover */}
      {isBlog && post.cover_image_url && (
        <img
          src={post.cover_image_url}
          alt={post.title ?? ""}
          className="w-full h-44 object-cover rounded-xl mb-4 mt-2"
        />
      )}

      {/* Author row */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9 border border-border">
            <AvatarFallback className="bg-primary/20 text-primary font-semibold text-xs">
              {initials(post.author.name)}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium text-foreground leading-none">{post.author.name}</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {post.author.branch ?? "Student"} · {timeAgo(post.created_at)}
            </p>
          </div>
        </div>

        <Badge
          variant="outline"
          className={cn(
            "text-xs flex items-center gap-1",
            isBlog
              ? "bg-purple-500/10 border-purple-500/30 text-purple-400"
              : "bg-primary/10 border-primary/30 text-primary"
          )}
        >
          {isBlog ? <BookOpen className="h-3 w-3" /> : <PenLine className="h-3 w-3" />}
          {isBlog ? "Blog" : "Post"}
        </Badge>
      </div>

      {/* Content */}
      {post.title && (
        <h3 className="font-semibold font-serif text-foreground text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
          {post.title}
        </h3>
      )}
      <p className="text-sm text-muted-foreground line-clamp-3 mb-3 leading-relaxed">
        {post.content}
      </p>

      {/* Tags */}
      {post.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          {post.tags.map(tag => (
            <span key={tag} className="text-xs text-primary/80 bg-primary/10 px-2 py-0.5 rounded-full">
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-border/60">
        <div className="flex items-center gap-5">
          <button
            className={cn(
              "flex items-center gap-1.5 text-sm font-medium transition-colors",
              post.liked_by_me ? "text-red-400" : "text-muted-foreground hover:text-red-400"
            )}
            onClick={e => { e.stopPropagation(); onLike(post.id) }}
          >
            <Heart className={cn("h-4 w-4 transition-all", post.liked_by_me && "fill-red-400 scale-110")} />
            <span>{post.like_count}</span>
          </button>

          <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <MessageCircle className="h-4 w-4" />
            <span>{post.comment_count}</span>
          </span>

          {isBlog && (
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3.5 w-3.5" />
              {post.reading_time} min read
            </span>
          )}
        </div>

        {post.author.id === currentUserId && (
          <button
            className="text-muted-foreground hover:text-red-400 transition-colors p-1 rounded-lg hover:bg-red-400/10"
            onClick={e => { e.stopPropagation(); onDelete(post.id) }}
          >
            <Trash2 className="h-4 w-4" />
          </button>
        )}
      </div>
    </GlassCard>
  )
}

// ── Loading Skeleton ─────────────────────────────────────────────────────────
function PostSkeleton() {
  return (
    <GlassCard>
      <div className="flex items-center gap-3 mb-4">
        <Skeleton className="h-9 w-9 rounded-full" />
        <div className="space-y-1.5">
          <Skeleton className="h-3.5 w-28" />
          <Skeleton className="h-3 w-20" />
        </div>
      </div>
      <Skeleton className="h-5 w-3/4 mb-2" />
      <Skeleton className="h-4 w-full mb-1.5" />
      <Skeleton className="h-4 w-5/6 mb-4" />
      <div className="flex gap-3 pt-3 border-t border-border/60">
        <Skeleton className="h-4 w-12" />
        <Skeleton className="h-4 w-12" />
      </div>
    </GlassCard>
  )
}

// ── Main Page ────────────────────────────────────────────────────────────────
export default function FeedPage() {
  const { user } = useAuthStore()
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState("all")
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const fetchPosts = useCallback((p: number, type: string) => {
    setLoading(true)
    const params: Record<string, string | number> = { page: p }
    if (type !== "all") params.type = type
    api.get("/feed/posts", { params })
      .then(res => { setPosts(res.data.posts); setTotalPages(res.data.pages) })
      .catch(() => toast.error("Failed to load feed"))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => { fetchPosts(page, filter) }, [page, filter, fetchPosts])

  const handleLike = async (postId: number) => {
    try {
      const res = await api.post(`/feed/posts/${postId}/like`)
      setPosts(prev => prev.map(p =>
        p.id === postId ? { ...p, liked_by_me: res.data.liked, like_count: res.data.like_count } : p
      ))
    } catch { toast.error("Failed to like") }
  }

  const handleDelete = async (postId: number) => {
    try {
      await api.delete(`/feed/posts/${postId}`)
      setPosts(prev => prev.filter(p => p.id !== postId))
      toast.success("Post deleted")
    } catch { toast.error("Failed to delete") }
  }

  const handleFilterChange = (val: string) => { setFilter(val); setPage(1) }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-serif text-foreground">College Feed</h1>
          <p className="text-muted-foreground mt-1">Posts and blogs from your college community</p>
        </div>
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <Newspaper className="h-5 w-5 text-primary" />
        </div>
      </div>

      {/* Create panel */}
      <CreatePostPanel user={user} onCreated={post => setPosts(prev => [post, ...prev])} />

      {/* Filter tabs */}
      <div className="flex items-center justify-between">
        <Tabs value={filter} onValueChange={handleFilterChange}>
          <TabsList className="bg-secondary/50 p-1">
            {[
              { value: "all", label: "All" },
              { value: "post", label: "Posts" },
              { value: "blog", label: "Blogs" },
            ].map(t => (
              <TabsTrigger
                key={t.value}
                value={t.value}
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-sm"
              >
                {t.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        {!loading && (
          <p className="text-xs text-muted-foreground">
            Page {page} of {totalPages}
          </p>
        )}
      </div>

      {/* Posts */}
      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => <PostSkeleton key={i} />)}
        </div>
      ) : posts.length === 0 ? (
        <GlassCard className="py-16 text-center">
          <div className="w-16 h-16 rounded-2xl bg-secondary/50 flex items-center justify-center mx-auto mb-4">
            <Newspaper className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold font-serif text-foreground mb-2">Nothing here yet</h3>
          <p className="text-sm text-muted-foreground">Be the first to post something in your college feed</p>
        </GlassCard>
      ) : (
        <div className="space-y-4">
          {posts.map(post => (
            <PostCard
              key={post.id}
              post={post}
              onLike={handleLike}
              onDelete={handleDelete}
              currentUserId={user?.id as number ?? 0}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3">
          <Button
            variant="outline"
            size="sm"
            disabled={page === 1}
            onClick={() => setPage(p => p - 1)}
            className="border-border text-foreground hover:bg-secondary/80"
          >
            <ChevronLeft className="h-4 w-4 mr-1" /> Prev
          </Button>
          <span className="text-sm text-muted-foreground px-2">
            {page} / {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page === totalPages}
            onClick={() => setPage(p => p + 1)}
            className="border-border text-foreground hover:bg-secondary/80"
          >
            Next <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      )}
    </div>
  )
}
