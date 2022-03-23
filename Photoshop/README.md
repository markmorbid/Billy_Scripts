# ContentAwareCrop
A Photoshop script that extends the edges for all non-square images in a desired folder by using the Content-Aware fill feature.

I made this script to prepare a large image dataset for processing in a GAN. I didn't like the fact that most other scripts and solutions I found simply cropped into the image and lost a lot of the structure/layout present in the original images.

The way it works is by scanning through all of the folders in the target parent folder, and then looping through all of the images present in those folders while appending completed folders to a text file that saves the current progress. This allows the script to be resumed after an interupption like a program crash or power outage, without getting bogged down by saving a massive file list of tens or hundreds of thousands of images.

Each image is opened in Photoshop, downscaled to make the longest dimension of the image match the target width/height (default 1024) to make the content aware processing faster, the edges are expanded to make the image a square, and then the content aware fill is used to paint in the newly added blank space.

I have also added a pre-crop to remove any existing border around the image before processing. Otherwise, the content aware fill will use undesired pixels around the edges and give bad results. 


For a dataset of around 165,000 images, it took approximately 22 days to complete. Most of that is because the content aware fill only uses the CPU, but I think the extra time is worth it because the quality of the final images is much better when compared to other solutions. I looked into using OpenCV for doing the inpainting around the edges, but in my research I found a few examples of people saying that it had trouble working on the edges around an image and it is primarily focused on inpainting holes within the main part of an image.

In the future, I will add example pictures to show comparisons of other techniques vs this script to give a better idea of the final result.
