# Developer Portfolio Templates

A collection of modern, responsive portfolio templates built with Next.js and TailwindCSS. Perfect for developers looking to showcase their work with minimal setup.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

🌐 **[View All Templates](https://www.devportfoliotemplates.com)**

## Features

- 📱 Fully responsive designs for all devices
- 🎨 Modern and clean UI with smooth animations
- 🚀 Built with performance in mind
- 📝 Easy to customize and maintain
- 🌙 Dark/Light versions
- 🎯 SEO optimized

## Tech Stack

- Next.js
- React
- TypeScript
- TailwindCSS

## Getting Started

You have two options to get started with your preferred template:

### Option 1: Using Git Sparse Checkout

If you want to clone only a specific portfolio template:

```bash
git clone --no-checkout https://github.com/devportfoliotemplates/devportfoliotemplates.git
cd devportfoliotemplates
git sparse-checkout init --cone
git sparse-checkout set example-portfolio-template
git checkout
```

Replace `example-portfolio-template` with your preferred template name (`frontend-developer-portfolio-template`, `backend-developer-portfolio-template`, etc.).

### Option 2: Direct Download

You can download a specific portfolio template as a ZIP file:

1. Visit [download-directory.github.io](https://download-directory.github.io/)
2. Paste the URL of your preferred portfolio folder (e.g., `https://github.com/devportfoliotemplates/devportfoliotemplates/tree/main/frontend-developer-portfolio-template`)
3. Download and extract the ZIP file

### Running the Template

Once you have your preferred template:

1. Install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

2. Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser to see the portfolio.

## Customization

### Personal Information

1. Update metadata in `app/layout.tsx`:

   - Site title
   - Description
   - Open Graph metadata
   - Favicon

2. Modify content in `app/page.tsx`:

   - Hero section
   - About section
   - Projects
   - Contact information

3. Replace assets:
   - Replace images in the `public` directory
   - Update social media icons
   - Modify logo if needed

### Styling

1. Colors and Theme:

   - Customize colors in `tailwind.config.js`
   - Modify theme variables in `app/globals.css`

2. Typography:

   - Update font families in `tailwind.config.js`
   - Modify text sizes and weights

3. Layout:
   - Adjust spacing and padding in component files
   - Modify responsive breakpoints in `tailwind.config.js`

## Troubleshooting

### Common Issues

1. **Build Errors**

   - Ensure all dependencies are installed
   - Clear `.next` folder and node_modules
   - Run `npm install` again

2. **Styling Issues**

   - Run `npm run build` to ensure TailwindCSS classes are generated
   - Check for conflicting styles in `globals.css`

3. **Image Loading**
   - Verify images are in the correct format (PNG, JPG, WebP)
   - Check image paths are correct
   - Ensure images are in the `public` directory

## Deployment

Follow these steps to deploy your portfolio for free using GitHub and Vercel:

1. Create a new GitHub repository

2. Push your portfolio to GitHub

3. Deploy with Vercel:
   - Go to [Vercel](https://vercel.com)
   - Sign up or log in with GitHub
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will automatically detect Next.js
   - Click "Deploy"

Your portfolio will be live in minutes with a free Vercel domain (e.g., `your-repo.vercel.app`). You can later add a custom domain in your Vercel project settings.

## Contributing

Contributions are welcome! Here's how you can help:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/improvement`)
3. Make your changes
4. Commit your changes (`git commit -am 'Add new feature'`)
5. Push to the branch (`git push origin feature/improvement`)
6. Create a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

If you find these templates helpful, please consider:

- Starring the repository ⭐
- Sharing with other developers
- [Buying me a coffee](https://www.buymeacoffee.com/andreiancu) ☕

For issues and feature requests, please [create an issue](https://github.com/devportfoliotemplates/devportfoliotemplates/issues).
