import ContentWrapper from '@/components/ContentWrapper'

const Unauthorized: React.FC = () => {

  return (
    <ContentWrapper>
      <div className="font-bold text-2xl text-center">
        <div className="text-4xl">
          You've found the velvet rope!
        </div>
        <div className="text-lg my-4">
          Come back when you have some real credentials!
        </div>

      </div>
    </ContentWrapper>
  )
}

export default Unauthorized