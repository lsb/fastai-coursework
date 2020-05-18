# Lesson 2

## Motivating example: prune your training data, serve your model over HTTP, DIY SGD

### Major takeaways from lecture

#### Good

* this is super exciting, I bailed out of my timebox last time for serving the model up 😅
* widgets for data cleaning seems _SUPER USEFUL_
  * omg I have built this multiple times in my life and never want to do it again omg
* CPUs being sufficient for inference is heartening
  * though this is pre-Turing, so, maybe GPUs helps get more FPS doing vision inference
* inference looks to be built out of stuff relatively similar to training. TBD!
* the Jupyter animation (with the y=ax+b SGD) seems super useful
* running hopscotch through cells in a Jupyter notebook is extremely big Alan Perlis SICP preface energy

> This book is dedicated, in respect and admiration, to the spirit that lives in the computer.
>
> "I think that it's extraordinarily important that we in computer science keep fun in computing. When it started out, it was an awful lot of fun. Of course, the paying customers got shafted every now and then, and after a while we began to take their complaints seriously. We began to feel as if we really were responsible for the successful, error-free perfect use of these machines. I don't think we are. I think we're responsible for stretching them, setting them off in new directions, and keeping fun in the house. I hope the field of computer science never loses its sense of fun. Above all, I hope we don't become missionaries. Don't feel as if you're Bible salesmen. The world has too many of those already. What you know about computing other people will learn. Don't feel as if the key to successful computing is only in your hands. What's in your hands, I think and hope, is intelligence: the ability to see the machine as more than when you were first led up to it, that you can make it more."
>
> Alan J. Perlis (April 1, 1922-February 7, 1990)

#### Interesting

* I literally made a mistake trying to manually run an unrolled for loop in following along
* this freewheeling style does not seem like an "onion in the varnish"; probably worth sticking with it, to find my own freewheeling style
* note that the "reproducible research" aspect is very much a concern: the random number seed is recorded
  * but the order of operations is mostly inferred from other parts of the sketch of the algorithm, thus not necessary to record

### Project to reinforce the lecture!

The most fascinating aspect of the exercise was the serving up a model to passers-by on HTTP, so let's make that!

The collection of urls from Google Images via CSV (which no longer seems to work, based on their pages changing?) seems like a convenience over `wget`, which is convenient enough as is?

Stretch goal: webapp with webcam -> art/plant/text

