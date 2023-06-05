FROM public.ecr.aws/h4m7c9h3/baseimages:node-16
WORKDIR /app
COPY ./ ./
RUN npm install
CMD npm run deploy
