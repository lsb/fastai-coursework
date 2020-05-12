# Lesson 1

## Motivating example: what's your pet, in the OxfordIIIT Pet Dataset

### Major takeaways from lecture

#### Good

* the fastai libraries are very much batteries-included
* oversight of the existing data is discussed and important
* abundance of models trained on general Imagenet data
* the tutorial has you running code for 2 minutes to refine a generic model to detect a few dozen types of animals with ≈ < 10% error
  * this feels like magic, and is HIGHLY motivational
  * the authors' best accuracy is 60%, more than 4x better in 8 years (& almost no user code!)

#### Interesting

* guts of Resnet34 / Resnet50 are not discussed
  * seemingly interchangeable with Mobilenet/Inception/et cetera
* off-the-shelf models just download from ✨somewhere✨ on the internet, into a local cache
* definitely more computer vision than artificial intelligence
  * this definitely feels like taking a submarine from Dover to Calais versus training to swim those 33.3 km
  * course goals explicitly practical right now, and not "building a brain"

#### Surprising

* oversight of the continued curation of the data is not mentioned (adding kittehs + doggos? people who rescind consent for their photos?)
  * who took the photos‽ [Parkhi et al](https://www.robots.ox.ac.uk/~vgg/publications/2012/parkhi12a/parkhi12a.pdf) just says "people" from Catster and Dogster and Flickr and 〈sic〉 Google images
* pretty freewheeling license of the data and code (can you use this on a military drone? facial analysis for criminality, phrenology 2.0? et cetera)

### Project to reinforce the lecture!

The most fascinating aspect of the exercise was the ratio of Imagenet training images, to kitteh/pupper refinement images: seven thousand images, after ~1M images in the 1TB corpus of Imagenet.

I want to try for a more imbalanced ratio, learning text/image/plant, with just seven image samples each for the three classes!

These categories look fairly different, but there's only 7x3 training images! We'll see how it goes.

Doing a little boosting, adding 10 duplicates of each training example during training (manually, via `cp`; looking into changing the default data loader is left for later), greatly helps convergence (compared to 0 duplicates).

TODO: take this model, convert it to ONNX, and run it entirely in the browser connected to a webcam feed.

