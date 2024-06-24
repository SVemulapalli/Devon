import Editor, { Monaco } from '@monaco-editor/react'
import type { editor } from 'monaco-editor'
import FileTabs from '@/panels/editor/components/file-tabs/file-tabs'
import { File } from '@/lib/types'
export default function CodeEditor({
    files,
    selectedFileId,
    setSelectedFileId,
    isExpandedVariant = false,
    showEditorBorders,
    path,
}: {
    files: File[]
    selectedFileId: string | null
    setSelectedFileId: (id: string) => void
    isExpandedVariant?: boolean
    showEditorBorders: boolean
    path: string
}): JSX.Element {
    // const searchParams = useSearchParams()
    // const chatId = searchParams.get('chat')

    const handleEditorDidMount = (
        editor: editor.IStandaloneCodeEditor,
        monaco: Monaco
    ) => {
        monaco.editor.defineTheme('theme', {
            base: 'vs-dark',
            inherit: true,
            rules: [],
            colors: {
                // 'editor.background': bgColor,
            },
        })

        monaco.editor.setTheme('theme')
    }

    // if (!selectedFileId) {
    //     return (
    //         <>
    //             <FileTabs
    //                 files={files}
    //                 selectedFileId={selectedFileId ?? files[0]?.id}
    //                 setSelectedFileId={setSelectedFileId}
    //                 // chatId={chatId}
    //                 className={showEditorBorders ? '' : 'mr-[13px]'}
    //                 isExpandedVariant={isExpandedVariant}
    //             />
    //             {files.length > 0 && (
    //                 <PathDisplay path={'/Users/devon/projects/hello_world'} />
    //             )}
    //             <div className="w-full bg-workspace rounded-b-lg mt-[-2px]">
    //                 {selectedFileId && (
    //                     <BothEditorTypes
    //                         file={files?.find(f => f.id === selectedFileId)}
    //                         handleEditorDidMount={handleEditorDidMount}
    //                     />
    //                 )}
    //             </div>
    //         </>
    //     )
    // }

    const bgColor = getComputedStyle(document.documentElement)
        .getPropertyValue('--bg-workspace')
        .trim()

    // if (isExpandedVariant) {
    //     return (
    //         <div className="w-full bg-workspace rounded-b-lg overflow-hidden">
    //             <BothEditorTypes
    //                 file={files?.find(f => f.id === selectedFileId)}
    //                 handleEditorDidMount={handleEditorDidMount}
    //             />
    //         </div>
    //     )
    // }

    return (
        <div className="flex flex-col h-full overflow-hidden">
            <div className="flex-none overflow-x-auto whitespace-nowrap bg-night border-b border-outlinecolor">
                <FileTabs
                    files={files}
                    selectedFileId={selectedFileId ?? null}
                    setSelectedFileId={setSelectedFileId}
                    className={showEditorBorders ? '' : ''}
                    isExpandedVariant={isExpandedVariant}
                    loading={files.length === 0}
                />
            </div>
            {files && (
                <PathDisplay path={path} selectedFileId={selectedFileId} />
            )}
            <div className="flex-grow w-full bg-midnight rounded-b-lg mt-[-2px] overflow-auto">
                {selectedFileId && (
                    <BothEditorTypes
                        file={files?.find(f => f.id === selectedFileId)}
                        handleEditorDidMount={handleEditorDidMount}
                    />
                )}
            </div>
        </div>
    )
}

const BothEditorTypes = ({
    file,
    handleEditorDidMount,
}: {
    file: File | undefined
    handleEditorDidMount: (
        editor: editor.IStandaloneCodeEditor,
        monaco: Monaco
    ) => void
}) => (
    <Editor
        className="h-full"
        theme="vs-dark"
        defaultLanguage={'python'}
        language={file?.language ?? 'python'}
        defaultValue={''}
        value={file?.value?.lines ?? ''}
        onMount={handleEditorDidMount}
        path={file?.path}
        options={{ readOnly: true, fontSize: 10 }}
    />
)

function getPathBeforeLastSlash(str: string) {
    // Remove trailing slash if it exists
    str = str.replace(/\/$/, '')

    // Find the position of the last slash
    const lastSlashIndex = str.lastIndexOf('/')

    // Return the substring before the last slash
    return lastSlashIndex !== -1 ? str.substring(0, lastSlashIndex) : ''
}

const PathDisplay = ({
    path,
    selectedFileId,
}: {
    path: string
    selectedFileId: string
}) => (
    <div
        className={`px-3 pb-[4px] ${
            selectedFileId ? 'bg-night -mt-[2px]' : 'pt-[3px]'
        }`}
    >
        <p className="text-xs text-neutral-500">
            {selectedFileId
                ? convertPath(
                      selectedFileId.replace(getPathBeforeLastSlash(path), '')
                  )
                : path
                ? convertPath(path)
                : ''}
        </p>
    </div>
)

export function convertPath(path: string) {
    // Split the path based on the separator, either "/" or "\"
    const parts = path.split(/[/\\]/)

    // Remove unwanted parts (e.g., initial "Users" or "C:" for Windows paths)
    const filteredParts = parts.filter(
        part => part && part !== 'Users' && !part.includes(':')
    )

    // Join the remaining parts with the custom separator
    const customPath = filteredParts.join(' > ')

    return customPath
}