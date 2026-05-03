'use client'

/* eslint-disable react-hooks/set-state-in-effect */
import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  Archive,
  Check,
  Clipboard,
  Eye,
  EyeOff,
  Image as ImageIcon,
  Loader2,
  Plus,
  RefreshCw,
  Save,
  Search,
  Trash2,
  Upload,
  X,
} from 'lucide-react'

type SourceType = 'public' | 'remote' | 'upload'
type AssetStatus = 'active' | 'draft' | 'archived'

type MediaAsset = {
  _id?: string
  title: string
  slug: string
  sourceKey: string
  sourceType: SourceType
  sourceUrl: string
  assetPath?: string
  folder?: string
  placements: string[]
  minWidth?: number
  minHeight?: number
  aspectRatio?: string
  altText?: string
  caption?: string
  tags: string[]
  status: AssetStatus
  width?: number
  height?: number
  fileSizeKb?: number
  cloudinaryPublicId?: string
  notes?: string
}

type AssetSummary = {
  total: number
  bySource: Record<string, number>
  byFolder: Record<string, number>
}

type ApiResponse = {
  success: boolean
  assets?: MediaAsset[]
  summary?: AssetSummary
  error?: string
}

type UploadResponse = {
  success: boolean
  upload?: {
    public_id: string
    secure_url: string
    width?: number
    height?: number
    bytes?: number
  }
  error?: string
}

type MediaFormState = {
  _id?: string
  title: string
  slug: string
  sourceKey: string
  sourceType: SourceType
  sourceUrl: string
  assetPath: string
  folder: string
  placementsText: string
  minWidth: string
  minHeight: string
  aspectRatio: string
  altText: string
  caption: string
  tagsText: string
  status: AssetStatus
  width: string
  height: string
  fileSizeKb: string
  cloudinaryPublicId: string
  notes: string
}

const FOLDER_OPTIONS = [
  { value: 'all', label: 'All photos' },
  { value: 'root', label: 'General' },
  { value: 'commercial-sites-photos', label: 'Commercial projects' },
  { value: 'residential-sites-photos', label: 'Residential projects' },
]

const PLACEMENT_OPTIONS = ['Homepage', 'Projects', 'Services', 'Blogs', 'About page', 'Gallery']
const TAG_SUGGESTIONS = ['residential', 'commercial', 'kitchen', 'living-room', 'bedroom', 'office', '3d-design', 'construction']

const emptyForm = (): MediaFormState => ({
  title: '',
  slug: '',
  sourceKey: '',
  sourceType: 'upload',
  sourceUrl: '',
  assetPath: '',
  folder: 'root',
  placementsText: '',
  minWidth: '',
  minHeight: '',
  aspectRatio: '',
  altText: '',
  caption: '',
  tagsText: '',
  status: 'active',
  width: '',
  height: '',
  fileSizeKb: '',
  cloudinaryPublicId: '',
  notes: '',
})

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')

const splitList = (value: string) =>
  value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)

const joinList = (items: string[] | undefined) => (items?.length ? items.join(', ') : '')

const normalizeAssetUrl = (value?: string) => {
  if (!value) return ''

  const normalized = value.trim().replace(/\\/g, '/')
  if (!normalized) return ''

  // Keep already absolute URLs untouched.
  if (/^(https?:)?\/\//i.test(normalized) || normalized.startsWith('data:') || normalized.startsWith('blob:')) {
    return normalized
  }

  // Ensure local assets resolve from the root instead of /admin/media/*.
  return normalized.startsWith('/') ? normalized : `/${normalized}`
}

const getPreviewSrc = (asset: MediaAsset | MediaFormState) => {
  if (asset.sourceType === 'public') {
    return normalizeAssetUrl(asset.assetPath || asset.sourceUrl)
  }

  return normalizeAssetUrl(asset.sourceUrl)
}

const getFolderLabel = (folder?: string) =>
  FOLDER_OPTIONS.find((option) => option.value === (folder || 'root'))?.label || folder || 'General'

const getDisplayPath = (asset: MediaAsset | MediaFormState) => getPreviewSrc(asset) || ''

const getSmartTitle = (fileNameOrPath: string) => {
  const name = fileNameOrPath.split('/').pop()?.split('\\').pop() || 'new-photo'
  return name
    .replace(/\.[^.]+$/, '')
    .replace(/[-_]+/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase())
}

const buildPayload = (form: MediaFormState) => {
  const sourceUrl =
    form.sourceType === 'public'
      ? normalizeAssetUrl(form.assetPath || form.sourceUrl)
      : form.sourceUrl.trim()
  const title = form.title.trim() || getSmartTitle(sourceUrl || 'media asset')
  const slug = form.slug.trim() || slugify(title)
  const sourceKey =
    form.sourceKey.trim() ||
    (form.sourceType === 'public'
      ? `public:${sourceUrl}`
      : form.sourceType === 'upload'
        ? `upload:${form.cloudinaryPublicId || sourceUrl}`
        : `remote:${sourceUrl}`)

  return {
    _id: form._id,
    title,
    slug,
    sourceKey,
    sourceType: form.sourceType,
    sourceUrl,
    assetPath: form.sourceType === 'public' ? normalizeAssetUrl(form.assetPath || sourceUrl) : undefined,
    folder: form.folder.trim() || 'root',
    placements: splitList(form.placementsText),
    minWidth: form.minWidth ? Number(form.minWidth) : undefined,
    minHeight: form.minHeight ? Number(form.minHeight) : undefined,
    aspectRatio: form.aspectRatio.trim() || undefined,
    altText: form.altText.trim() || title,
    caption: form.caption.trim(),
    tags: splitList(form.tagsText),
    status: form.status,
    width: form.width ? Number(form.width) : undefined,
    height: form.height ? Number(form.height) : undefined,
    fileSizeKb: form.fileSizeKb ? Number(form.fileSizeKb) : undefined,
    cloudinaryPublicId: form.cloudinaryPublicId.trim() || undefined,
    notes: form.notes.trim(),
  }
}

function MediaPreview({
  src,
  alt,
  className,
  iconClassName,
  message,
}: {
  src?: string
  alt: string
  className?: string
  iconClassName?: string
  message?: string
}) {
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    setFailed(false)
  }, [src])

  if (!src || failed) {
    return (
      <div className={className || 'flex h-full w-full items-center justify-center text-charcoal-800/30'}>
        <div className="flex flex-col items-center gap-2">
          <ImageIcon className={iconClassName || 'h-8 w-8'} />
          {message ? <span className="text-xs text-charcoal-800/45">{message}</span> : null}
        </div>
      </div>
    )
  }

  return <img src={src} alt={alt} className={className || 'h-full w-full object-cover'} onError={() => setFailed(true)} loading="lazy" />
}

export default function MediaManager() {
  const [assets, setAssets] = useState<MediaAsset[]>([])
  const [summary, setSummary] = useState<AssetSummary>({ total: 0, bySource: {}, byFolder: {} })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [placement, setPlacement] = useState('all')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [form, setForm] = useState<MediaFormState>(emptyForm())
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [advancedOpen, setAdvancedOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  const selectedAsset = useMemo(
    () => assets.find((asset) => asset._id === selectedId) || null,
    [assets, selectedId],
  )

  const visibleCount = assets.filter((asset) => asset.status === 'active').length
  const draftCount = assets.filter((asset) => asset.status === 'draft').length
  const hiddenCount = assets.filter((asset) => asset.status === 'archived').length
  const showSkeleton = loading && assets.length === 0
  const showRefreshingNotice = loading && assets.length > 0

  const loadAssets = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const params = new URLSearchParams()
      if (search) params.set('search', search)
      if (category !== 'all') params.set('category', category)
      if (statusFilter !== 'all') params.set('status', statusFilter)
      if (placement !== 'all') params.set('placement', placement)

      const response = await fetch(`/api/admin/media?${params.toString()}`, { cache: 'no-store' })
      const body = (await response.json()) as ApiResponse

      if (!response.ok || !body.success || !body.assets) {
        throw new Error(body.error || 'Unable to load photos.')
      }

      setAssets(body.assets)
      setSummary(body.summary ?? { total: body.assets.length, bySource: {}, byFolder: {} })

      if (!selectedId && body.assets[0]) {
        setSelectedId(body.assets[0]._id || null)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load photos.')
    } finally {
      setLoading(false)
    }
  }, [category, search, selectedId, statusFilter, placement])

  useEffect(() => {
    void loadAssets()
  }, [loadAssets])

  useEffect(() => {
    if (!selectedAsset) {
      setForm(emptyForm())
      return
    }

    setForm({
      _id: selectedAsset._id,
      title: selectedAsset.title || '',
      slug: selectedAsset.slug || '',
      sourceKey: selectedAsset.sourceKey || '',
      sourceType: selectedAsset.sourceType || 'upload',
      sourceUrl: selectedAsset.sourceUrl || '',
      assetPath: selectedAsset.assetPath || '',
      folder: selectedAsset.folder || 'root',
      placementsText: joinList(selectedAsset.placements),
      minWidth: selectedAsset.minWidth?.toString() || '',
      minHeight: selectedAsset.minHeight?.toString() || '',
      aspectRatio: selectedAsset.aspectRatio || '',
      altText: selectedAsset.altText || '',
      caption: selectedAsset.caption || '',
      tagsText: joinList(selectedAsset.tags),
      status: selectedAsset.status || 'active',
      width: selectedAsset.width?.toString() || '',
      height: selectedAsset.height?.toString() || '',
      fileSizeKb: selectedAsset.fileSizeKb?.toString() || '',
      cloudinaryPublicId: selectedAsset.cloudinaryPublicId || '',
      notes: selectedAsset.notes || '',
    })
    setFile(null)
    setCopied(false)
  }, [selectedAsset])

  const saveAsset = async (override?: Partial<MediaFormState>) => {
    setSaving(true)
    setError(null)
    setMessage(null)

    try {
      const nextForm = { ...form, ...override }
      const payload = buildPayload(nextForm)
      const response = await fetch(nextForm._id ? `/api/admin/media/${nextForm._id}` : '/api/admin/media', {
        method: nextForm._id ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const body = (await response.json()) as { success?: boolean; asset?: MediaAsset; error?: string }
      if (!response.ok || !body.success || !body.asset) {
        throw new Error(body.error || 'Unable to save this photo.')
      }

      setMessage('Saved.')
      setSelectedId(body.asset._id || null)
      await loadAssets()
      return body.asset
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to save this photo.')
      return null
    } finally {
      setSaving(false)
    }
  }

  const uploadAndSave = async () => {
    if (!file) {
      setError('Choose a photo first.')
      return
    }

    setUploading(true)
    setError(null)
    setMessage(null)

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('folder', form.folder === 'root' ? 'mih-admin' : form.folder)

      const response = await fetch('/api/admin/media/upload', {
        method: 'POST',
        body: formData,
      })

      const body = (await response.json()) as UploadResponse
      if (!response.ok || !body.success || !body.upload) {
        throw new Error(body.error || 'Unable to upload this photo.')
      }

      const nextForm: MediaFormState = {
        ...form,
        title: form.title || getSmartTitle(file.name),
        slug: form.slug || slugify(form.title || getSmartTitle(file.name)),
        sourceType: 'upload',
        sourceUrl: body.upload.secure_url,
        cloudinaryPublicId: body.upload.public_id,
        width: body.upload.width?.toString() || form.width,
        height: body.upload.height?.toString() || form.height,
        fileSizeKb: body.upload.bytes ? Math.max(1, Math.round(body.upload.bytes / 1024)).toString() : form.fileSizeKb,
        altText: form.altText || form.title || getSmartTitle(file.name),
      }

      setForm(nextForm)
      const saved = await saveAsset(nextForm)
      if (saved) {
        setMessage('Photo uploaded and saved.')
        setFile(null)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to upload this photo.')
    } finally {
      setUploading(false)
    }
  }

  const updateStatus = async (status: AssetStatus) => {
    if (!form._id) return
    await saveAsset({ status })
  }

  const deleteAsset = async () => {
    if (!form._id) return
    if (!window.confirm('Delete this photo from the library?')) return

    setSaving(true)
    setError(null)
    setMessage(null)

    try {
      const response = await fetch(`/api/admin/media/${form._id}`, { method: 'DELETE' })
      const body = (await response.json()) as { success?: boolean; error?: string }

      if (!response.ok || !body.success) {
        throw new Error(body.error || 'Unable to delete this photo.')
      }

      setMessage('Photo deleted.')
      setSelectedId(null)
      setForm(emptyForm())
      await loadAssets()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to delete this photo.')
    } finally {
      setSaving(false)
    }
  }

  const startNew = () => {
    setSelectedId(null)
    setForm(emptyForm())
    setFile(null)
    setError(null)
    setMessage(null)
    setAdvancedOpen(false)
  }

  const copyLink = async () => {
    const value = getDisplayPath(form)
    if (!value) return

    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      setTimeout(() => setCopied(false), 1400)
    } catch {
      setCopied(false)
    }
  }

  const togglePlacement = (placement: string) => {
    const current = splitList(form.placementsText)
    const next = current.includes(placement)
      ? current.filter((item) => item !== placement)
      : [...current, placement]

    setForm((value) => ({ ...value, placementsText: next.join(', ') }))
  }

  const addTag = (tag: string) => {
    const current = splitList(form.tagsText)
    if (current.includes(tag)) return
    setForm((value) => ({ ...value, tagsText: [...current, tag].join(', ') }))
  }

  return (
    <div className="space-y-6">
      <section className="border border-white/70 bg-white/90 p-5 shadow-[0_18px_48px_rgba(54,41,33,0.08)] sm:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-brown-700">Photo Library</p>
            <h2 className="mt-2 font-display text-4xl text-charcoal-900">Manage website photos</h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-charcoal-700/70">
              Add photos, choose where they belong, write a simple caption, and hide old photos without touching technical settings.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={startNew}
              className="inline-flex items-center gap-2 rounded-md bg-charcoal-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-brown-800"
            >
              <Plus className="h-4 w-4" />
              Add photo
            </button>
            <button
              type="button"
              onClick={() => void loadAssets()}
              className="inline-flex items-center gap-2 rounded-md border border-cream-200 bg-white px-4 py-3 text-sm font-semibold text-charcoal-800 transition hover:border-brown-700/30"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </button>
          </div>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          {[
            { label: 'Visible now', value: visibleCount, icon: Eye },
            { label: 'Needs review', value: draftCount, icon: Save },
            { label: 'Hidden photos', value: hiddenCount, icon: Archive },
          ].map((item) => (
            <div key={item.label} className="rounded-lg border border-cream-200 bg-[#fbf7f1] p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-semibold text-charcoal-800">{item.label}</p>
                <item.icon className="h-4 w-4 text-brown-700" />
              </div>
              <p className="mt-2 font-display text-3xl text-charcoal-900">{item.value}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_430px]">
        <div className="border border-white/70 bg-white/90 p-4 shadow-[0_18px_48px_rgba(54,41,33,0.08)] sm:p-5">
          <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
            <label className="flex h-12 items-center gap-2 rounded-md border border-cream-200 bg-white px-4 text-sm">
              <Search className="h-4 w-4 text-charcoal-800/45" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search by photo name, room, project, or caption"
                className="w-full bg-transparent outline-none placeholder:text-charcoal-800/38"
              />
            </label>

            <div className="flex flex-wrap gap-2">
              {[
                { value: 'active', label: 'Visible' },
                { value: 'draft', label: 'Review' },
                { value: 'archived', label: 'Hidden' },
                { value: 'all', label: 'All' },
              ].map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setStatusFilter(option.value)}
                  className={`rounded-md px-3 py-2 text-xs font-semibold transition ${
                    statusFilter === option.value
                      ? 'bg-charcoal-900 text-white'
                      : 'border border-cream-200 bg-white text-charcoal-700 hover:border-brown-700/30'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-4 space-y-3">
            <div>
              <p className="text-xs font-semibold text-charcoal-700 uppercase tracking-wide">Filter by page</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {['all', 'Homepage', 'Services', 'Projects', 'Blogs', 'About page', 'Gallery'].map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setPlacement(option)}
                    className={`rounded-md px-3 py-2 text-xs font-semibold transition ${
                      placement === option
                        ? 'bg-green-100 text-green-900'
                        : 'border border-cream-200 bg-white text-charcoal-700 hover:border-brown-700/30'
                    }`}
                  >
                    {option === 'all' ? 'All pages' : option}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-2 overflow-x-auto pb-1">
              {FOLDER_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setCategory(option.value)}
                  className={`shrink-0 rounded-md px-3 py-2 text-xs font-semibold transition ${
                    category === option.value
                      ? 'bg-[#f0dfc8] text-brown-900'
                      : 'border border-cream-200 bg-white text-charcoal-700 hover:border-brown-700/30'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {message && (
            <div className="mt-4 rounded-md border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
              {message}
            </div>
          )}

          {error && (
            <div className="mt-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {showSkeleton ? (
            <div className="mt-4 flex min-h-80 items-center justify-center rounded-lg border border-dashed border-cream-200 text-charcoal-700/60">
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Loading photos...
            </div>
          ) : assets.length === 0 ? (
            <div className="mt-4 flex min-h-80 flex-col items-center justify-center rounded-lg border border-dashed border-cream-200 px-6 text-center">
              <ImageIcon className="h-9 w-9 text-charcoal-800/28" />
              <h3 className="mt-3 font-display text-2xl text-charcoal-900">No photos found</h3>
              <p className="mt-2 max-w-sm text-sm leading-6 text-charcoal-700/65">
                Try another search, or add a new photo using the panel on the right.
              </p>
            </div>
          ) : (
            <>
              {showRefreshingNotice ? (
                <div className="mt-4 inline-flex items-center gap-2 rounded-md border border-cream-200 bg-[#fbf7f1] px-3 py-2 text-xs font-semibold text-charcoal-700/70">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Refreshing photos...
                </div>
              ) : null}

              <div className="mt-4 grid gap-4 sm:grid-cols-2 2xl:grid-cols-3">
                {assets.map((asset) => {
                  const previewSrc = getPreviewSrc(asset)
                  const isSelected = selectedAsset?._id === asset._id

                  return (
                    <button
                      key={asset._id}
                      type="button"
                      onClick={() => setSelectedId(asset._id || null)}
                      className={`overflow-hidden rounded-lg border bg-white text-left transition hover:-translate-y-0.5 hover:shadow-lg ${
                        isSelected ? 'border-brown-700 shadow-lg shadow-brown-900/10' : 'border-cream-200'
                      }`}
                    >
                      <div className="relative aspect-4/3 bg-charcoal-900/5">
                        <MediaPreview
                          src={previewSrc}
                          alt={asset.altText || asset.title}
                          className="h-full w-full object-cover"
                          iconClassName="h-8 w-8"
                          message="Preview unavailable"
                        />
                        <span className="absolute left-2 top-2 rounded-md bg-white/92 px-2 py-1 text-[11px] font-semibold text-charcoal-800 shadow-sm">
                          {getFolderLabel(asset.folder)}
                        </span>
                        <span className={`absolute right-2 top-2 rounded-md px-2 py-1 text-[11px] font-semibold shadow-sm ${
                          asset.status === 'active'
                            ? 'bg-green-50 text-green-700'
                            : asset.status === 'draft'
                              ? 'bg-amber-50 text-amber-700'
                              : 'bg-charcoal-900 text-white'
                        }`}>
                          {asset.status === 'active' ? 'Visible' : asset.status === 'draft' ? 'Review' : 'Hidden'}
                        </span>
                      </div>
                      <div className="p-3">
                        <h3 className="truncate font-display text-xl text-charcoal-900">{asset.title}</h3>
                        <p className="mt-1 line-clamp-2 min-h-10 text-sm leading-5 text-charcoal-700/65">
                          {asset.caption || asset.altText || 'No caption added yet.'}
                        </p>
                      </div>
                    </button>
                  )
                })}
              </div>
            </>
          )}
        </div>

        <aside className="border border-white/70 bg-white/90 p-4 shadow-[0_18px_48px_rgba(54,41,33,0.08)] sm:p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-brown-700">
                {form._id ? 'Selected photo' : 'Add new photo'}
              </p>
              <h3 className="mt-2 font-display text-3xl text-charcoal-900">
                {form.title || 'Photo details'}
              </h3>
            </div>
            {form._id && (
              <button
                type="button"
                onClick={startNew}
                className="rounded-md border border-cream-200 bg-white p-2 text-charcoal-700 hover:border-brown-700/30"
                aria-label="Close selected photo"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <div className="mt-5 overflow-hidden rounded-lg border border-cream-200 bg-[#fbf7f1]">
            <div className="relative aspect-4/3">
              <MediaPreview
                src={getPreviewSrc(form)}
                alt={form.altText || form.title || 'Selected photo'}
                className="h-full w-full object-cover"
                iconClassName="h-9 w-9"
                message={getPreviewSrc(form) ? 'Preview unavailable' : 'Choose or upload a photo'}
              />
            </div>
          </div>

          <div className="mt-4 rounded-lg border border-dashed border-[#d7c7b4] bg-[#fbf7f1] p-4">
            <p className="text-sm font-semibold text-charcoal-900">Upload and save in one step</p>
            <p className="mt-1 text-xs leading-5 text-charcoal-700/65">
              Choose a photo. The system fills the link, size, title, and saves it to the library.
            </p>
            <div className="mt-3 flex flex-col gap-2">
              <input
                type="file"
                accept="image/*"
                onChange={(event) => setFile(event.target.files?.[0] || null)}
                className="w-full rounded-md border border-cream-200 bg-white px-3 py-2 text-xs"
              />
              <button
                type="button"
                onClick={() => void uploadAndSave()}
                disabled={!file || uploading || saving}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-charcoal-900 px-4 text-sm font-semibold text-white transition hover:bg-brown-800 disabled:opacity-50"
              >
                {uploading || saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                Upload photo
              </button>
            </div>
          </div>

          <div className="mt-5 space-y-4">
            <label className="block">
              <span className="mb-2 block text-xs font-semibold text-charcoal-800">Photo name</span>
              <input
                value={form.title}
                onChange={(event) => setForm((current) => ({ ...current, title: event.target.value, slug: current.slug || slugify(event.target.value) }))}
                placeholder="Example: Modern kitchen in Mohali"
                className="h-11 w-full rounded-md border border-cream-200 bg-white px-3 text-sm outline-none focus:border-brown-700/50"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-xs font-semibold text-charcoal-800">Short caption</span>
              <textarea
                value={form.caption}
                onChange={(event) => setForm((current) => ({ ...current, caption: event.target.value }))}
                placeholder="Write what this photo shows."
                rows={3}
                className="w-full rounded-md border border-cream-200 bg-white px-3 py-2 text-sm outline-none focus:border-brown-700/50"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-xs font-semibold text-charcoal-800">Where should this photo be grouped?</span>
              <select
                value={form.folder}
                onChange={(event) => setForm((current) => ({ ...current, folder: event.target.value }))}
                className="h-11 w-full rounded-md border border-cream-200 bg-white px-3 text-sm outline-none focus:border-brown-700/50"
              >
                {FOLDER_OPTIONS.filter((option) => option.value !== 'all').map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <div>
              <p className="mb-2 text-xs font-semibold text-charcoal-800">Where will it be used?</p>
              <div className="flex flex-wrap gap-2">
                {PLACEMENT_OPTIONS.map((placement) => {
                  const active = splitList(form.placementsText).includes(placement)
                  return (
                    <button
                      key={placement}
                      type="button"
                      onClick={() => togglePlacement(placement)}
                      className={`rounded-md px-3 py-2 text-xs font-semibold transition ${
                        active ? 'bg-[#f0dfc8] text-brown-900' : 'border border-cream-200 bg-white text-charcoal-700'
                      }`}
                    >
                      {placement}
                    </button>
                  )
                })}
              </div>
            </div>

            <div>
              <p className="mb-2 text-xs font-semibold text-charcoal-800">Quick labels</p>
              <div className="flex flex-wrap gap-2">
                {TAG_SUGGESTIONS.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => addTag(tag)}
                    className="rounded-md border border-cream-200 bg-white px-3 py-2 text-xs font-semibold text-charcoal-700 transition hover:border-brown-700/30"
                  >
                    {tag}
                  </button>
                ))}
              </div>
              <input
                value={form.tagsText}
                onChange={(event) => setForm((current) => ({ ...current, tagsText: event.target.value }))}
                placeholder="Labels appear here"
                className="mt-2 h-10 w-full rounded-md border border-cream-200 bg-white px-3 text-sm outline-none focus:border-brown-700/50"
              />
            </div>

            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => void updateStatus('active')}
                disabled={!form._id || saving}
                className="inline-flex items-center justify-center gap-1 rounded-md border border-green-200 bg-green-50 px-2 py-2 text-xs font-semibold text-green-700 disabled:opacity-45"
              >
                <Eye className="h-3.5 w-3.5" />
                Show
              </button>
              <button
                type="button"
                onClick={() => void updateStatus('draft')}
                disabled={!form._id || saving}
                className="inline-flex items-center justify-center gap-1 rounded-md border border-amber-200 bg-amber-50 px-2 py-2 text-xs font-semibold text-amber-700 disabled:opacity-45"
              >
                <Save className="h-3.5 w-3.5" />
                Review
              </button>
              <button
                type="button"
                onClick={() => void updateStatus('archived')}
                disabled={!form._id || saving}
                className="inline-flex items-center justify-center gap-1 rounded-md border border-charcoal-900/10 bg-charcoal-900 px-2 py-2 text-xs font-semibold text-white disabled:opacity-45"
              >
                <EyeOff className="h-3.5 w-3.5" />
                Hide
              </button>
            </div>

            <button
              type="button"
              onClick={() => void saveAsset()}
              disabled={saving}
              className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-brown-800 px-4 text-sm font-semibold text-white transition hover:bg-brown-900 disabled:opacity-60"
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
              Save changes
            </button>

            <button
              type="button"
              onClick={() => void copyLink()}
              disabled={!getDisplayPath(form)}
              className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-md border border-cream-200 bg-white px-4 text-sm font-semibold text-charcoal-800 transition hover:border-brown-700/30 disabled:opacity-45"
            >
              <Clipboard className="h-4 w-4" />
              {copied ? 'Copied image link' : 'Copy image link'}
            </button>

            <details
              open={advancedOpen}
              onToggle={(event) => setAdvancedOpen(event.currentTarget.open)}
              className="rounded-lg border border-cream-200 bg-white"
            >
              <summary className="cursor-pointer px-4 py-3 text-sm font-semibold text-charcoal-900">
                Advanced details
              </summary>
              <div className="space-y-3 border-t border-cream-200 p-4">
                <label className="block">
                  <span className="mb-1 block text-xs font-semibold text-charcoal-700">Image link or public path</span>
                  <input
                    value={form.sourceType === 'public' ? form.assetPath : form.sourceUrl}
                    onChange={(event) => {
                      const value = event.target.value
                      setForm((current) => ({
                        ...current,
                        sourceType: value.startsWith('/') ? 'public' : current.sourceType === 'public' ? 'remote' : current.sourceType,
                        assetPath: value.startsWith('/') ? value : current.assetPath,
                        sourceUrl: value.startsWith('/') ? current.sourceUrl : value,
                      }))
                    }}
                    className="h-10 w-full rounded-md border border-cream-200 bg-[#fbf7f1] px-3 text-sm outline-none"
                  />
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <label className="block">
                    <span className="mb-1 block text-xs font-semibold text-charcoal-700">Web address name</span>
                    <input value={form.slug} onChange={(event) => setForm((current) => ({ ...current, slug: event.target.value }))} className="h-10 w-full rounded-md border border-cream-200 bg-[#fbf7f1] px-3 text-sm outline-none" />
                  </label>
                  <label className="block">
                    <span className="mb-1 block text-xs font-semibold text-charcoal-700">Source</span>
                    <select value={form.sourceType} onChange={(event) => setForm((current) => ({ ...current, sourceType: event.target.value as SourceType }))} className="h-10 w-full rounded-md border border-cream-200 bg-[#fbf7f1] px-3 text-sm outline-none">
                      <option value="upload">Uploaded</option>
                      <option value="public">Website file</option>
                      <option value="remote">External link</option>
                    </select>
                  </label>
                </div>
                <label className="block">
                  <span className="mb-1 block text-xs font-semibold text-charcoal-700">Search/accessibility text</span>
                  <input value={form.altText} onChange={(event) => setForm((current) => ({ ...current, altText: event.target.value }))} className="h-10 w-full rounded-md border border-cream-200 bg-[#fbf7f1] px-3 text-sm outline-none" />
                </label>
                <label className="block">
                  <span className="mb-1 block text-xs font-semibold text-charcoal-700">Internal note</span>
                  <textarea value={form.notes} onChange={(event) => setForm((current) => ({ ...current, notes: event.target.value }))} rows={3} className="w-full rounded-md border border-cream-200 bg-[#fbf7f1] px-3 py-2 text-sm outline-none" />
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <input aria-label="Width" placeholder="Width" value={form.width} onChange={(event) => setForm((current) => ({ ...current, width: event.target.value }))} className="h-10 rounded-md border border-cream-200 bg-[#fbf7f1] px-3 text-sm outline-none" />
                  <input aria-label="Height" placeholder="Height" value={form.height} onChange={(event) => setForm((current) => ({ ...current, height: event.target.value }))} className="h-10 rounded-md border border-cream-200 bg-[#fbf7f1] px-3 text-sm outline-none" />
                  <input aria-label="File size" placeholder="Size KB" value={form.fileSizeKb} onChange={(event) => setForm((current) => ({ ...current, fileSizeKb: event.target.value }))} className="h-10 rounded-md border border-cream-200 bg-[#fbf7f1] px-3 text-sm outline-none" />
                </div>
              </div>
            </details>

            <button
              type="button"
              onClick={() => void deleteAsset()}
              disabled={!form._id || saving}
              className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-md border border-red-200 bg-red-50 px-4 text-sm font-semibold text-red-700 transition hover:bg-red-100 disabled:opacity-45"
            >
              <Trash2 className="h-4 w-4" />
              Delete photo
            </button>
          </div>

          <p className="mt-5 text-center text-xs text-charcoal-700/55">
            Total in current view: {summary.total}
          </p>
        </aside>
      </section>
    </div>
  )
}
