'use client'
import React, { useRef, useState } from 'react'
import { Image as ImageIcon } from 'lucide-react'

const Page = () => {
  const [logo, setLogo] = useState<File | null>(null)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [companyName, setCompanyName] = useState('')
  const [companyAddress, setCompanyAddress] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null)
    const file = e.target.files?.[0]
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Only image files are allowed.')
        return
      }
      if (file.size > 2 * 1024 * 1024) {
        setError('Image must be less than 2MB.')
        return
      }
      setLogo(file)
      setLogoPreview(URL.createObjectURL(file))
    }
  }

  const handleClear = () => {
    setCompanyName('')
    setCompanyAddress('')
    setLogo(null)
    setLogoPreview(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
    setError(null)
  }

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white rounded-lg shadow-lg p-8 space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">Company Information</h1>
      <form className="space-y-6" aria-label="Company Information Form">
        {/* Company Name */}
        <div>
          <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-1">
            Company Name
          </label>
          <input
            type="text"
            id="companyName"
            name="companyName"
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="Enter company name"
            required
            aria-required="true"
            value={companyName}
            onChange={e => setCompanyName(e.target.value)}
          />
        </div>
        {/* Company Address */}
        <div>
          <label htmlFor="companyAddress" className="block text-sm font-medium text-gray-700 mb-1">
            Company Address
          </label>
          <textarea
            id="companyAddress"
            name="companyAddress"
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="Enter company address"
            rows={3}
            required
            aria-required="true"
            value={companyAddress}
            onChange={e => setCompanyAddress(e.target.value)}
          />
        </div>
        {/* Upload Logo */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="companyLogo">
            Upload Logo
          </label>
          <div>
            <div
              className="flex flex-col items-center justify-center w-full h-42 border-2 border-dashed border-blue-600 rounded-md cursor-pointer bg-gray-50 hover:bg-blue-50 transition relative"
              tabIndex={0}
              role="button"
              aria-label="Upload company logo"
              onClick={() => fileInputRef.current?.click()}
              onKeyDown={e => {
                if (e.key === 'Enter' || e.key === ' ') fileInputRef.current?.click()
              }}
            >
              {logoPreview ? (
                <div className="relative w-full h-full flex flex-col items-center justify-center">
                  <img
                    src={logoPreview}
                    alt="Logo preview"
                    className="object-contain h-full w-full rounded"
                  />
                  <span className="absolute bottom-2 left-1/2 -translate-x-1/2 text-blue-500 text-xs px-2 py-1 rounded">
                    Click to change the image
                  </span>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8">
                  <ImageIcon className="w-8 h-8 text-blue-400 mb-2" aria-hidden="true" />
                  <span className="text-gray-400 text-sm">Click to upload logo</span>
                  <span className="text-xs text-gray-300 mt-1">Image, max 2MB</span>
                </div>
              )}
            </div>
            <input
              ref={fileInputRef}
              id="companyLogo"
              name="companyLogo"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleLogoChange}
              aria-label="Company logo file input"
            />
            {error && (
              <div className="text-red-500 text-xs mt-2" role="alert">
                {error}
              </div>
            )}
          </div>
        </div>
        {/* Submit & Clear Buttons */}
        <div className="flex gap-4">
          <button
            type="submit"
            className="flex-1 py-2 px-4 text-primary-600 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md hover:bg-primary-50 focus:outline-none focus:ring-primary-500"
          >
            Save
          </button>
          <button
            type="button"
            className="flex-1 py-2 px-4 border !border-blue-600 text-gray-700 rounded-md hover:bg-blue-100"
            onClick={handleClear}
            aria-label="Clear form"
          >
            Clear
          </button>
        </div>
      </form>
    </div>
  )
}

export default Page