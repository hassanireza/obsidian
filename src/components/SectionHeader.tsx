import { Link } from "react-router-dom";
import { IconArrow } from "./icons";
import "./sectionHeader.css";

interface SectionHeaderProps {
  /** Roman numeral, a quiet nod to the brand's ritual numbering. */
  numeral?: string;
  title: string;
  seeAllHref?: string;
  seeAllLabel?: string;
  id?: string;
}

export default function SectionHeader({
  numeral,
  title,
  seeAllHref,
  seeAllLabel = "See all",
  id,
}: SectionHeaderProps) {
  return (
    <div className="section-header">
      <div>
        {numeral && <p className="label-caps section-header__numeral">{numeral}</p>}
        <h2 className="section-header__title" id={id}>
          {title}
        </h2>
      </div>
      {seeAllHref && (
        <Link to={seeAllHref} className="section-header__see-all">
          {seeAllLabel} <IconArrow />
        </Link>
      )}
    </div>
  );
}
