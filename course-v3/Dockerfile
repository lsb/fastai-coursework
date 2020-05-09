FROM pytorch/pytorch:1.4-cuda10.1-cudnn7-runtime
CMD jupyter notebook --notebook-dir=. --ip 127.0.0.1 --no-browser --allow-root
RUN conda install -c fastai fastai jupyter
RUN which jupyter
