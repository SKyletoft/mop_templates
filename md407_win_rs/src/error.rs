use std::{fmt::Display, str::FromStr};

use crate::Mode;

impl FromStr for Mode {
	type Err = Error;

	fn from_str(s: &str) -> Result<Self, Self::Err> {
		let lowercase = s.to_lowercase();
		let res = match lowercase.as_str() {
			"load" => Mode::Load,
			"go" => Mode::Go,
			"interactive" => Mode::Interactive,
			_ => return Err(Error),
		};
		Ok(res)
	}
}

impl Display for Mode {
	fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
		write!(f, "{self:?}")
	}
}

#[derive(Debug, Copy, Clone, PartialEq)]
pub struct Error;

impl Display for Error {
	fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
		write!(f, "Error")
	}
}

impl std::error::Error for Error {}
