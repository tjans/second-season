import ContentWrapper from '@/components/ContentWrapper'

const PageNotFound: React.FC = () => {
  return (
    <ContentWrapper>
      <div className="font-bold text-2xl text-center">
        <div className="text-4xl">
          Well, this is awkward...
        </div>
        <div className="text-lg my-4">
          We can't find the page you're looking for. Have you checked your mom's house?
        </div>

      </div>
    </ContentWrapper>
  )
}

export default PageNotFound