import * as React from "react";

type Props = React.AnchorHTMLAttributes<HTMLAnchorElement>;

function isExternal(href?: string) {
    try {
        return !!href && /^https?:\/\//i.test(href);
    } catch {
        return false;
    }
}

export function MdxLink({ href, children, className, rel, target, ...rest }: Props) {
    const external = isExternal(href);
    const finalTarget = external ? "_blank" : target;
    const finalRel = external ? ["noopener", "noreferrer", rel].filter(Boolean).join(" ") : rel;

    return (
        <a href={href} target={finalTarget} rel={finalRel} className={className} {...rest}>
            {children}
        </a>
    );
}
