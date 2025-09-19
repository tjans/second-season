import Link from '@/components/Elements/Link'
import ContentWrapper from '@/components/ContentWrapper'

const Members: React.FC = () => {
  return (
    <ContentWrapper>
      <p>This is the <strong>members page</strong>.  You can only get here if you are logged in as a member.</p>

      
      <ul>
        <li><Link to="/styles/buttons">Buttons</Link></li>
        <li><Link to="/styles/links">Links</Link></li>
        <li><Link to="/styles/textinputs">TextInputs</Link></li>
        <li><Link to="/styles/selectinputs">SelectInputs</Link></li>
        <li><Link to="/styles/forms">Forms</Link></li>
      </ul>
    </ContentWrapper>
  )
}

export default Members