
export const metadata = {
    title : "Noodle",
    description : "a RAG chat bot to integrate into your website"
}

const RootLayout = ({children})=>{
    return (
        <html lang="en">
        <body>{children}</body>
        </html>
    )
}

export default RootLayout