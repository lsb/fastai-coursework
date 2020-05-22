docker build -t $(basename $PWD) . && docker run --net host -it $(basename $PWD)
