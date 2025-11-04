This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

const res = await fetch(`/api/chat?userId=${userId}`);
        const data = await res.json();

            console.log(formData);
  const [alert, setAlert] = useState<AlertProps | null>(null);
  setAlert({
        icon: <Ban />,
        title: "Error",
        message: "You must be signed in to create a room",
      });

      
  useEffect(() => {
    if (alert) {
      const timer = setTimeout(() => {
        setAlert(null);
      }, 3000); // 4 seconds
      return () => clearTimeout(timer);
    }
  }, [alert]);


 <button
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent opening file browser
                            if (!isUploaded) {
                              startUpload([file]); // startUpload expects an array
                            }
                          }}
                          disabled={isUploading || isUploaded}
                          className={`px-4 py-2 rounded-md transition-colors flex items-center gap-2 mx-auto bg-blue ${
                            isUploaded
                              ? "bg-green-600 text-white cursor-default"
                              : "bg-indigo-600 text-white hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                          }`}
                        >
                          {isUploading ? (
                            "Uploading..."
                          ) : isUploaded ? (
                            <>
                              <Check size={16} />
                              Uploaded
                            </>
                          ) : (
                            "Upload Resume"
                          )}
                        </button>