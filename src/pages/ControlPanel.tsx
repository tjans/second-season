import ContentWrapper from '@/components/ContentWrapper'

const ControlPanel: React.FC = () => {
  return (
    <ContentWrapper>
      This is the control panel page.  You can only get here if you are logged in as an admin.
    </ContentWrapper>
  )
}

export default ControlPanel