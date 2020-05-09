(docker build -t $(basename $PWD) - < ./Dockerfile) && docker run --net host --ipc host -v $PWD:$PWD -w $PWD $(basename $PWD)
